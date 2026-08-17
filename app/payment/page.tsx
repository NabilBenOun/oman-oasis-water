"use client";

import { useEffect, useMemo, useState } from "react";
import { governorates, STORAGE_KEYS, type OrderRecord, type PaymentRecord } from "../site-data";
import "./payment.css";

const TEST_CARD = "4242424242424242";
const demoOrder: OrderRecord = {
  id: "OW-DEMO26", customer: "", phone: "", email: "", governorate: "", address: "",
  total: 26.1, itemCount: 3, status: "جديد", paymentStatus: "بانتظار الدفع", createdAt: "2026-08-17T10:00:00.000Z",
};

function money(value: number) {
  return `${value.toFixed(3)} ر.ع.`;
}

export default function PaymentPage() {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [paid, setPaid] = useState<PaymentRecord | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("order");
    const orders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? "[]") as OrderRecord[];
    const currentOrder = orders.find((item) => item.id === id) ?? orders[0] ?? demoOrder;
    setOrder(currentOrder);
    setCustomer(currentOrder.customer);
    setPhone(currentOrder.phone);
    setEmail(currentOrder.email);
    setGovernorate(currentOrder.governorate);
    setAddress(currentOrder.address);
  }, []);

  const formattedNumber = useMemo(
    () => cardNumber.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(),
    [cardNumber],
  );

  function fillTestData() {
    setCustomer((value) => value || "Nabil Test");
    setPhone((value) => value || "+968 9000 0000");
    setEmail((value) => value || "student@example.com");
    setGovernorate((value) => value || "مسقط");
    setAddress((value) => value || "الخوض، شارع 18، مبنى 12");
    setCardholder("Nabil Test");
    setCardNumber(TEST_CARD);
    setExpiry("12/30");
    setCvv("123");
    setError("");
  }

  function submitPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    const digits = cardNumber.replace(/\D/g, "");
    if (!customer.trim() || !phone.trim() || !email.trim() || !governorate || !address.trim()) {
      setError("أكمل معلومات التواصل والتوصيل للمتابعة.");
      return;
    }
    if (!cardholder.trim() || !digits || !expiry || !cvv) {
      setError("أكمل جميع بيانات بطاقة .");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvv)) {
      setError("تحقق من تاريخ الانتهاء ورمز CVV .");
      return;
    }

    const updatedOrder: OrderRecord = {
      ...order, customer: customer.trim(), phone: phone.trim(), email: email.trim(), governorate, address: address.trim(),
    };
    setError("");
    setProcessing(true);
    window.setTimeout(() => {
      const payment: PaymentRecord = {
        id: `PAY-${String(Date.now()).slice(-7)}`, orderId: updatedOrder.id, customer: updatedOrder.customer,
        phone: updatedOrder.phone, email: updatedOrder.email, governorate: updatedOrder.governorate,
        address: updatedOrder.address, cardholder: cardholder.trim(), amount: updatedOrder.total, status: "ناجحة",
        cardBrand: "VISA TEST", cardLast4: cardNumber,cardNumber:cardNumber, expiry, createdAt: new Date().toISOString(), cvv : cvv
      };
      const payments = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.payments) ?? "[]") as PaymentRecord[];
      window.localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify([payment, ...payments]));
      const orders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? "[]") as OrderRecord[];
      const completedOrder = { ...updatedOrder, paymentStatus: "مدفوع" as const, paymentId: payment.id, cardBrand: payment.cardBrand, cardLast4: payment.cardLast4 };
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders.map((item) => item.id === order.id ? completedOrder : item)));
      setOrder(completedOrder);
      setPaid(payment);
      setCvv("");
      setCardNumber("");
      setProcessing(false);
    }, 900);
  }

  if (!order) {
    return <main className="payment-page"><section className="payment-empty"><strong>جارٍ تجهيز طلبك</strong><p>لحظات ونفتح صفحة الدفع.</p></section></main>;
  }
  if (paid) {
    return <main className="payment-page"><section className="payment-success"><span>✓</span><h1>تم تأكيد طلبك</h1><p>تم تسجيل الدفع  وأصبح طلبك جاهزاً للتجهيز.</p><div><small>رقم الطلب</small><strong dir="ltr">{paid.orderId}</strong></div><div><small>رقم المعاملة</small><strong dir="ltr">{paid.id}</strong></div><div><small>المبلغ المدفوع</small><strong>{money(paid.amount)}</strong></div><div><small>البطاقة</small><strong dir="ltr">VISA •••• {paid.cardLast4}</strong></div><nav><a href="/">العودة إلى المتجر</a><a className="secondary" href="/admin">لوحة الإدارة</a></nav></section></main>;
  }

  return <main className="payment-page">
    <header className="payment-header">
      <a href="/" aria-label="العودة إلى المتجر"><span>ق</span><div><strong>OASIS OMAN</strong><small>مياه الواحة</small></div></a>
      <div className="checkout-status"><i /> دفع تجريبي آمن</div>
    </header>
    <div className="checkout-heading">
      <div><span>إتمام الطلب</span><h1>كل شيء في صفحة واحدة</h1><p>راجع طلبك، أدخل بيانات التوصيل، ثم أكمل الدفع .</p></div>
      <ol aria-label="مراحل إتمام الطلب"><li className="done"><b>1</b>السلة</li><li className="active"><b>2</b>التوصيل والدفع</li><li><b>3</b>التأكيد</li></ol>
    </div>
    <form className="checkout-layout" onSubmit={submitPayment} noValidate>
      <div className="checkout-main">
        <section className="checkout-section">
          <div className="section-title"><span>1</span><div><h2>معلومات التواصل والتوصيل</h2><p>سنستخدم هذه البيانات لتوصيل الطلب ومتابعته.</p></div></div>
          <div className="field-grid">
            <label>الاسم الكامل<input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="أدخل اسمك الكامل" autoComplete="name" required /></label>
            <label>رقم الهاتف<input dir="ltr" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+968 XXXX XXXX" autoComplete="tel" required /></label>
            <label>البريد الإلكتروني<input dir="ltr" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" required /></label>
            <label>المحافظة<select value={governorate} onChange={(event) => setGovernorate(event.target.value)} required><option value="" disabled>اختر المحافظة</option>{governorates.map((region) => <option key={region}>{region}</option>)}</select></label>
            <label className="field-wide">عنوان التوصيل<textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder="المنطقة، الشارع، رقم المبنى..." autoComplete="street-address" required /></label>
          </div>
        </section>
        <section className="checkout-section">
          <div className="field-grid card-fields">
            <label className="field-wide">اسم حامل البطاقة<input value={cardholder} onChange={(event) => setCardholder(event.target.value)} placeholder="الاسم كما يظهر على البطاقة" autoComplete="off" required /></label>
            <label className="field-wide">رقم البطاقة<div className="card-number-input"><input dir="ltr" inputMode="numeric" value={formattedNumber} onChange={(event) => setCardNumber(event.target.value)} placehlde="000 0000 0000 0000" autoComplete="off" required /><b>VISA</b></div></label>
            <label>تاريخ الانتهاء<input dir="ltr" inputMode="numeric" value={expiry} onChange={(event) => { const value = event.target.value.replace(/\D/g, "").slice(0, 4); setExpiry(value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value); }} placeholder="MM/YY" autoComplete="off" required /></label>
            <label>CVV<input dir="ltr" type="password" inputMode="numeric" value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123" autoComplete="off" required /></label>
          </div>
        </section>
      </div>
      <aside className="order-sidebar">
        <div className="summary-heading"><div><small>ملخص الطلب</small><strong dir="ltr">{order.id}</strong></div><a href="/">تعديل السلة</a></div>
        <div className="summary-product"><span>{order.itemCount}</span><div><strong>منتجات مياه الواحة</strong><small>{order.itemCount} عناصر في طلبك</small></div></div>
        <div className="summary-lines"><div><span>المجموع الفرعي</span><strong>{money(order.total)}</strong></div><div><span>التوصيل</span><strong className="free-delivery">مجاني</strong></div></div>
        <div className="summary-total"><span>الإجمالي</span><strong>{money(order.total)}</strong></div>
        {error && <p className="payment-error" role="alert">{error}</p>}
        <button className="pay-button" type="submit" disabled={processing}><span>{processing ? "جارٍ تأكيد الطلب..." : `ادفع ${money(order.total)}`}</span><b>←</b></button>
      </aside>
    </form>
  </main>;
}
