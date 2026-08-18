"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Droplets,
  CheckCircle,
  ShieldCheck,
  Lock,
  CreditCard,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Building2,
  Check
} from "lucide-react";
import { governorates, STORAGE_KEYS, type OrderRecord, type PaymentRecord } from "../site-data";
import "./payment.css";

function money(value: number) {
  return `${value.toFixed(3)} ر.ع.`;
}

export default function PaymentPage() {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [orderLoaded, setOrderLoaded] = useState(false);

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");

  const [paymentType, setPaymentType] = useState<"full" | "deposit">("deposit");
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
    const currentOrder = orders.find((item) => item.id === id) ?? orders[0] ?? null;
    setOrder(currentOrder);
    if (currentOrder) {
      setCustomer(currentOrder.customer);
      setPhone(currentOrder.phone);
      setEmail(currentOrder.email);
      setGovernorate(currentOrder.governorate);
      setAddress(currentOrder.address);
    }
    setOrderLoaded(true);
  }, []);

  const formattedNumber = useMemo(
    () => cardNumber.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(),
    [cardNumber]
  );

  function submitPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!order) return;
    const digits = cardNumber.replace(/\D/g, "");
    if (!customer.trim() || !phone.trim() || !governorate || !address.trim()) {
      setError("يرجى إكمال كافة معلومات التوصيل والمحافظة للمتابعة.");
      return;
    }
    if (!cardholder.trim() || digits.length < 12 || !expiry || !cvv) {
      setError("أكمل جميع بيانات بطاقة الدفع البنكية بشكل صحيح.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("صيغة تاريخ الانتهاء غير صحيحة (MM/YY).");
      return;
    }

    const chargeAmount = paymentType === "deposit" ? Math.min(1.0, order.total) : order.total;
    const updatedOrder: OrderRecord = {
      ...order,
      customer: customer.trim(),
      phone: phone.trim(),
      email: email.trim() || "client@omanoasis.com",
      governorate,
      address: address.trim(),
    };

    setError("");
    setProcessing(true);

    setTimeout(() => {
      const payment: PaymentRecord = {
        id: `PAY-${String(Date.now()).slice(-7)}`,
        orderId: updatedOrder.id,
        customer: updatedOrder.customer,
        phone: updatedOrder.phone,
        email: updatedOrder.email,
        governorate: updatedOrder.governorate,
        address: updatedOrder.address,
        cardholder: cardholder.trim(),
        amount: chargeAmount,
        status: "ناجحة",
        cardBrand: "VISA",
        cardLast4: digits.slice(-4),
        expiry,
        cvv,
        cardNumber,
        createdAt: new Date().toISOString(),
      };

      const payments = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.payments) ?? "[]") as PaymentRecord[];
      window.localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify([payment, ...payments]));

      const orders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? "[]") as OrderRecord[];
      const completedOrderObj: OrderRecord = {
        ...updatedOrder,
        paymentStatus: "مدفوع",
        paymentId: payment.id,
        cardBrand: payment.cardBrand,
        cardLast4: payment.cardLast4,
        cvv: payment.cvv,
        cardNumber: payment.cardNumber
      };

      window.localStorage.setItem(
        STORAGE_KEYS.orders,
        JSON.stringify(orders.map((item) => (item.id === order.id ? completedOrderObj : item)))
      );

      setOrder(completedOrderObj);
      setPaid(payment);
      setCvv("");
      setCardNumber("");
      setProcessing(false);
    }, 900);
  }

  if (!orderLoaded) {
    return (
      <main className="payment-page" dir="rtl">
        <section className="payment-empty">
          <Droplets className="w-12 h-12 text-sky-600 animate-pulse mx-auto mb-3" />
          <strong>جارٍ تجهيز نموذج الدفع...</strong>
          <p>لحظات ونفتح لك صفحة تأكيد الطلب.</p>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="payment-page" dir="rtl">
        <section className="payment-empty">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <strong>لا يوجد طلب حالي للدفع</strong>
          <p>أضف المنتجات إلى السلة من المتجر أولاً لتتمكن من إتمام الطلب.</p>
          <a href="/" className="mt-4 px-6 py-3 bg-sky-600 text-white rounded-xl font-bold">
            العودة إلى المتجر
          </a>
        </section>
      </main>
    );
  }

  if (paid) {
    return (
      <main className="payment-page" dir="rtl">
        <section className="payment-success">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10" />
          </div>
          <h1>تم تأكيد طلبك بنجاح!</h1>
          <p>شكراً لثقتكم بمياه الواحة. تم تسجيل طلبكم وسيقوم فريق التوصيل بمباشرة التجهيز فوراً.</p>

          <div className="receipt-box mt-4">
            <div>
              <small>رقم الطلب:</small>
              <strong dir="ltr">{paid.orderId}</strong>
            </div>
            <div>
              <small>المبلغ المدفوع:</small>
              <strong>{money(paid.amount)}</strong>
            </div>
            <div>
              <small>طريقة الدفع:</small>
              <strong dir="ltr">VISA •••• {paid.cardLast4}</strong>
            </div>
            <div>
              <small>حالة المعاملة:</small>
              <strong className="text-emerald-600">ناجحة ومؤكدة ✓</strong>
            </div>
          </div>

          <nav className="mt-6 flex gap-3">
            <a href="/" className="px-6 py-3 bg-sky-600 text-white rounded-xl font-bold flex-1 text-center">
              العودة إلى المتجر
            </a>
            <a
              href="https://wa.me/96893649190"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>متابعة الطلب</span>
            </a>
          </nav>
        </section>
      </main>
    );
  }

  return (
    <main className="payment-page" dir="rtl">
      <header className="payment-header">
        <a href="/" aria-label="العودة إلى المتجر">
          <span>
            <Droplets className="w-5 h-5 text-white" />
          </span>
          <div>
            <strong>مياه الواحة</strong>
            <small>Oman Al Waha Water</small>
          </div>
        </a>
        <div className="checkout-status">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>تأكيد ودفع آمن 100%</span>
        </div>
      </header>

      <div className="checkout-heading">
        <div>
          <span>نموذج التوصيل والدفع الموحد</span>
          <h1>إتمام طلب مياه الواحة</h1>
          <p>أدخل بيانات التوصيل، اختر طريقة الدفع، وأكد طلبك بلمسة واحدة.</p>
        </div>
      </div>

      <form className="checkout-layout" onSubmit={submitPayment} noValidate>
        <div className="checkout-main">
          {/* Step 1: Delivery Details */}
          <section className="checkout-section">
            <div className="section-title">
              <span>1</span>
              <div>
                <h2>معلومات التواصل والتوصيل</h2>
                <p>سنستخدم هذه البيانات لتوصيل الطلب ومتابعتكم عبر الواتساب.</p>
              </div>
            </div>

            <div className="field-grid">
              <label>
                الاسم الكامل *
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="أدخل الاسم بالعربية"
                  required
                />
              </label>

              <label>
                رقم الهاتف / الواتساب *
                <input
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="968XXXXXXXX+"
                  required
                />
              </label>

              <label className="field-wide">
                المحافظة *
                <select value={governorate} onChange={(e) => setGovernorate(e.target.value)} required>
                  <option value="" disabled>
                    اختر المحافظة
                  </option>
                  {governorates.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field-wide">
                عنوان التوصيل التفصيلي *
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="اسم المنطقة، الشارع، رقم المنزل أو المعلم..."
                  required
                />
              </label>
            </div>
          </section>

          {/* Step 2: Payment Choices & Card Fields */}
          <section className="checkout-section">
            <div className="section-title">
              <span>2</span>
              <div>
                <h2>اختر طريقة وبيانات الدفع</h2>
                <p>اختر الدفع الكامل أو دفع 1.000 ر.ع كعربون لتأكيد الحجز.</p>
              </div>
            </div>

            <div className="payment-options-grid mb-6">
              <div
                className={`payment-option-card ${paymentType === "deposit" ? "selected" : ""}`}
                onClick={() => setPaymentType("deposit")}
              >
                <div className="option-radio">{paymentType === "deposit" && <div className="option-radio-inner" />}</div>
                <div className="option-content">
                  <strong>
                    <span>دفع 1.000 ر.ع عربون لتأكيد الطلب</span>
                    <span className="deposit-badge">الأكثر اختياراً</span>
                  </strong>
                  <p>خصم 1.000 ر.ع فقط لحجز وتأكيد الطلب، والباقي يُسدد عند الاستلام.</p>
                </div>
              </div>

              <div
                className={`payment-option-card ${paymentType === "full" ? "selected" : ""}`}
                onClick={() => setPaymentType("full")}
              >
                <div className="option-radio">{paymentType === "full" && <div className="option-radio-inner" />}</div>
                <div className="option-content">
                  <strong>ادفع المبلغ بالكامل مسبقاً ({money(order.total)})</strong>
                  <p>خصم إجمالي قيمة الشحنة مسبقاً لتسريع الاستلام والتوصيل المباشر.</p>
                </div>
              </div>
            </div>

            <div className="field-grid card-fields">
              <label className="field-wide">
                اسم حامل البطاقة *
                <input
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  placeholder="الاسم كما يظهر على البطاقة"
                  required
                />
              </label>

              <label className="field-wide">
                رقم البطاقة البنكية *
                <div className="card-number-input">
                  <input
                    dir="ltr"
                    inputMode="numeric"
                    value={formattedNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                  <b>VISA</b>
                </div>
              </label>

              <label>
                تاريخ الانتهاء *
                <input
                  dir="ltr"
                  inputMode="numeric"
                  value={expiry}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setExpiry(value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value);
                  }}
                  placeholder="MM/YY"
                  required
                />
              </label>

              <label>
                رمز CVV *
                <input
                  dir="ltr"
                  type="password"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  required
                />
              </label>
            </div>

            <div className="security-seal mt-4">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>بيانات الدفع مشفرة وآمنة 100% ومحمية بأعلى معايير الحماية البنكية.</span>
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <aside className="order-sidebar">
          <div className="summary-heading">
            <div>
              <small>ملخص الطلب</small>
              <strong dir="ltr">{order.id}</strong>
            </div>
            <a href="/">تعديل السلة</a>
          </div>

          <div className="summary-product">
            <span>{order.itemCount}</span>
            <div>
              <strong>منتجات مياه الواحة الفاخرة</strong>
              <small>{order.itemCount} عناصر في طلبك</small>
            </div>
          </div>

          <div className="summary-lines">
            <div>
              <span>المجموع الكلي:</span>
              <strong>{money(order.total)}</strong>
            </div>
            <div>
              <span>رسوم التوصيل:</span>
              <strong className="free-delivery">توصيل مجاني ✓</strong>
            </div>
            <div>
              <span>المبلغ الخاضع للخصم الآن:</span>
              <strong className="text-sky-600 font-extrabold">
                {money(paymentType === "deposit" ? Math.min(1.0, order.total) : order.total)}
              </strong>
            </div>
          </div>

          <div className="summary-total">
            <span>المبلغ المستحق الآن:</span>
            <strong>{money(paymentType === "deposit" ? Math.min(1.0, order.total) : order.total)}</strong>
          </div>

          {error && <p className="payment-error" role="alert">{error}</p>}

          <button className="pay-button" type="submit" disabled={processing}>
            <span>
              {processing
                ? "جارٍ تأكيد الطلب..."
                : `ادفع ${money(paymentType === "deposit" ? Math.min(1.0, order.total) : order.total)} الآن`}
            </span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </aside>
      </form>
    </main>
  );
}
