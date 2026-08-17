"use client";

import { useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, type OrderRecord, type PaymentRecord } from "../site-data";
import "./payment.css";

const TEST_CARD = "4242424242424242";
const demoOrder: OrderRecord = {
  id: "OW-DEMO26",
  customer: "طالب المشروع",
  phone: "+968 9000 0000",
  email: "student@example.com",
  governorate: "مسقط",
  address: "مشروع جامعي تجريبي",
  total: 26.1,
  itemCount: 3,
  status: "جديد",
  paymentStatus: "بانتظار الدفع",
  createdAt: "2026-08-17T10:00:00.000Z",
};

function money(value: number) {
  return `${value.toFixed(3)} ر.ع.`;
}

export default function PaymentPage() {
  const [order, setOrder] = useState<OrderRecord | null>(null);
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
    setOrder(orders.find((item) => item.id === id) ?? orders[0] ?? demoOrder);
  }, []);

  const formattedNumber = useMemo(() => cardNumber.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(), [cardNumber]);

  function submitPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    const digits = cardNumber.replace(/\D/g, "");
    if (!cardholder.trim() || !digits || !expiry || !cvv) {
      setError("أكمل اسم حامل البطاقة ورقم البطاقة وتاريخ الانتهاء وCVV.");
      return;
    }
    if (digits !== TEST_CARD) {
      setError("للمشروع التجريبي استخدم البطاقة 4242 4242 4242 4242 فقط.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry) || !/^\d{3,4}$/.test(cvv)) {
      setError("تحقق من تاريخ الانتهاء ورمز CVV التجريبي.");
      return;
    }
    setError("");
    setProcessing(true);
    window.setTimeout(() => {
      const payment: PaymentRecord = {
        id: `PAY-${String(Date.now()).slice(-7)}`,
        orderId: order.id,
        customer: order.customer,
        phone: order.phone,
        email: order.email,
        governorate: order.governorate,
        address: order.address,
        cardholder,
        amount: order.total,
        status: "ناجحة",
        cardBrand: "VISA TEST",
        cardLast4: digits.slice(-4),
        expiry,
        createdAt: new Date().toISOString(),
      };
      const payments = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.payments) ?? "[]") as PaymentRecord[];
      window.localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify([payment, ...payments]));
      const orders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? "[]") as OrderRecord[];
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders.map((item) => item.id === order.id ? { ...item, paymentStatus: "مدفوع", paymentId: payment.id, cardBrand: payment.cardBrand, cardLast4: payment.cardLast4 } : item)));
      setPaid(payment);
      setCvv("");
      setCardNumber("");
      setProcessing(false);
    }, 1100);
  }

  if (!order) {
    return <main className="payment-page"><section className="payment-empty"><strong>لا يوجد طلب للدفع</strong><p>أضف منتجات إلى السلة وأكمل بيانات التوصيل أولاً.</p><a href="/">العودة إلى المتجر</a></section></main>;
  }

  if (paid) {
    return <main className="payment-page"><section className="payment-success"><span>✓</span><h1>تم الدفع بنجاح</h1><p>تم تسجيل المعاملة التجريبية للطلب <b dir="ltr">{paid.orderId}</b>.</p><div><small>رقم المعاملة</small><strong dir="ltr">{paid.id}</strong></div><div><small>المبلغ</small><strong>{money(paid.amount)}</strong></div><div><small>البطاقة</small><strong dir="ltr">VISA •••• {paid.cardLast4}</strong></div><nav><a href="/admin">عرضها في لوحة الإدارة</a><a className="secondary" href="/">العودة إلى المتجر</a></nav></section></main>;
  }

  return <main className="payment-page">
    <header className="payment-header"><a href="/"><span>ق</span><div><strong>OASIS OMAN</strong><small>الدفع الآمن</small></div></a><b>وضع المشروع التجريبي</b></header>
    <section className="amount-banner"><span>▣</span><p>سيتم خصم إجمالي مبلغ الطلب: <strong>{money(order.total)}</strong> من بطاقتك.</p></section>
    <section className="payment-customer"><span>الطلب <b dir="ltr">{order.id}</b></span><span>{order.customer}</span><span>{order.governorate}</span></section>
    <form className="payment-form" onSubmit={submitPayment} noValidate>
      <div className="payment-form-title"><div><h1>بيانات الدفع</h1><p>استخدم بيانات البطاقة التجريبية فقط</p></div><button type="button" onClick={() => { setCardholder("Nabil Test"); setCardNumber(TEST_CARD); setExpiry("12/30"); setCvv("123"); setError(""); }}>ملء بيانات الاختبار</button></div>
      <label>اسم حامل البطاقة<input value={cardholder} onChange={(event) => setCardholder(event.target.value)} placeholder="اسم حامل البطاقة" autoComplete="cc-name" required /></label>
      <label>رقم البطاقة<input dir="ltr" inputMode="numeric" value={formattedNumber} onChange={(event) => setCardNumber(event.target.value)} placeholder="0000 0000 0000 0000" autoComplete="off" required /><small className="test-hint">بطاقة الاختبار: 4242 4242 4242 4242</small></label>
      <div className="payment-row">
        <label>تاريخ الانتهاء<input dir="ltr" inputMode="numeric" value={expiry} onChange={(event) => { const digits = event.target.value.replace(/\D/g, "").slice(0,4); setExpiry(digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits); }} placeholder="MM/YY" autoComplete="off" required /></label>
        <label>CVV<div className="cvv-input"><input dir="ltr" type="password" inputMode="numeric" value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0,4))} placeholder="CVV" autoComplete="off" required /><span>CVV</span></div></label>
      </div>
      <div className="payment-safety"><span>⌾</span><p><strong>بيانات تجريبية فقط.</strong> لا يتم حفظ رقم البطاقة الكامل أو رمز CVV.</p></div>
      {error && <p className="payment-error" role="alert">{error}</p>}
      <button className="pay-button" type="submit" disabled={processing}>{processing ? "جارٍ تنفيذ الدفع..." : "الدفع"}</button>
    </form>
  </main>;
}
