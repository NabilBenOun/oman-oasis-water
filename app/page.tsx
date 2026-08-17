"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultProducts, governorates, STORAGE_KEYS, type OrderRecord, type Product } from "./site-data";

const benefits = [
  ["⌁", "مصدر جبلي نقي", "مصدرها ينابيع طبيعية نقية في قلب جبال عمان."],
  ["◷", "توصيل في نفس اليوم", "اطلب قبل الظهر واستلم مياهك في نفس اليوم في مسقط."],
  ["✓", "جودة معتمدة دولياً", "مختبرة ومعتمدة وفق المعايير الدولية لراحة بالك."],
  ["♻", "تغليف صديق للبيئة", "زجاجات قابلة للتدوير 100% ومواد تغليف صديقة للبيئة."],
  ["♡", "أكثر من 382,949 عميل", "نخدم المنازل والمكاتب والمطاعم في كل محافظة بعمان."],
  ["◉", "دعم 24/7", "فريقنا متاح دائماً عبر واتساب والهاتف والبريد الإلكتروني."],
];

const quality = [
  ["120–180 mg/L", "مستوى TDS مثالي", "النطاق المثالي للطعم والصحة."],
  ["pH 7.4", "درجة حموضة متوازنة", "قلوية طبيعية تدعم وظائف الجسم الصحية."],
  ["Ca·Mg·K", "معادن أساسية", "غنية بالكالسيوم والمغنيسيوم والبوتاسيوم."],
  ["6 Stages", "ترشيح متعدد المراحل", "تنقية تشمل الأشعة فوق البنفسجية والتناضح العكسي."],
  ["Daily", "اختبار مختبري يومي", "كل دفعة تختبر قبل التوزيع."],
  ["ISO 9001", "شهادات دولية", "جودة متوافقة مع المعايير الدولية."],
];

const testimonials = [
  ["والله خدمة ما شاء الله، المياه وصلت بالوقت المحدد وطعمها زين جداً. نستخدم مياه الواحة من سنتين وما غيرناها.", "سالم بن ناصر الهنائي", "مسقط"],
  ["من أحسن الشركات اللي تعاملت معها، الموظفين محترمين والتوصيل يوصل بسرعة. أنصح فيها لكل عيلة تبغى مياه نقية.", "أم خالد العبرية", "نزوى"],
  ["اشتركت في التوصيل الشهري وما ندمت. المياه نظيفة دائماً والتغليف سليم، والسائق محترم كل مرة.", "إبراهيم الشكيلي", "صحار"],
];

const faqs = [
  ["متى سيصل طلبي؟", "الطلبات المقدمة قبل الساعة 12:00 ظهراً تُوصل في نفس اليوم في مسقط. في المحافظات الأخرى يستغرق التوصيل 1–2 يوم عمل."],
  ["هل التوصيل مجاني فعلاً؟", "نعم، نقدم توصيلاً مجانياً لجميع محافظات وولايات عمان بدون رسوم خفية أو حد أدنى للطلب."],
  ["ما طرق الدفع المقبولة؟", "نقبل بطاقات الائتمان والخصم الرئيسية، والحوالات البنكية، وبوابات الدفع الإلكترونية."],
  ["كيف أعلم أن المياه آمنة للشرب؟", "تخضع مياهنا لعملية تنقية صارمة من ست مراحل وتختبر يومياً وفق معايير الجودة الدولية."],
  ["هل يمكنني إعداد اشتراك توصيل منتظم؟", "نعم، تواصل معنا وسنعد جدول توصيل أسبوعي أو نصف شهري أو شهري يناسب احتياجاتك."],
  ["ما سياسة الاسترجاع لديكم؟", "تواصل معنا خلال 48 ساعة من التوصيل وسنرتب الاستبدال أو الاسترداد حسب حالة الطلب."],
];

function money(value: number) {
  return `${value.toFixed(3)} ر.ع.`;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

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

  const cartItems = useMemo(
    () => products.map((product) => ({ ...product, quantity: cart[product.id] ?? 0 })).filter((product) => product.quantity > 0),
    [cart],
  );
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(id: number) {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
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

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const order: OrderRecord = {
      id: `OW-${String(Date.now()).slice(-6)}`,
      customer: String(form.get("customer") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      governorate: String(form.get("governorate") ?? ""),
      address: String(form.get("address") ?? ""),
      total,
      itemCount: count,
      status: "جديد",
      createdAt: new Date().toISOString(),
    };
    const current = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders) ?? "[]") as OrderRecord[];
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([order, ...current]));
    setCart({});
    setCheckoutOpen(false);
    setOrderConfirmed(true);
    window.setTimeout(() => setOrderConfirmed(false), 4500);
  }

  return (
    <main className="site-shell">
      <header className="header-wrap">
        <nav className="topbar" aria-label="التنقل الرئيسي">
          <a className="brand" href="#home" aria-label="الصفحة الرئيسية">
            <span className="brand-copy"><strong>OASIS OMAN</strong><small>مياه الواحة</small></span>
            <span className="brand-mark">ق</span>
          </a>
          <div className="nav-links">
            <a className="active" href="#home">الرئيسية</a>
            <a href="#about">معلومات عنا</a>
            <a href="#contact">اتصل بنا</a>
            <a href="#faq">الأسئلة الشائعة</a>
            <a href="#policies">السياسات⌄</a>
          </div>
          <div className="nav-tools">
            <button className="language-button" type="button">عربي⌄</button>
            <button className="cart-button" type="button" onClick={() => setCartOpen(true)} aria-label="فتح السلة">
              <span className="cart-icon">⌑</span><b>{count}</b>
            </button>
            <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="فتح القائمة">{menuOpen ? "×" : "☰"}</button>
          </div>
        </nav>
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#home" onClick={() => setMenuOpen(false)}>الرئيسية</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>معلومات عنا</a>
            <a href="#products" onClick={() => setMenuOpen(false)}>منتجاتنا</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>الأسئلة الشائعة</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>اتصل بنا</a>
          </div>
        )}
      </header>

      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-overlay" />
        <span className="hero-ring ring-one" /><span className="hero-ring ring-two" />
        <div className="hero-copy">
          <p className="hero-badge">★ الخيار الأول للمياه الفاخرة في عمان ★</p>
          <h1>مياه الواحة… نقاء عمان يصل إليك.</h1>
          <p className="hero-text">مياه معبأة فاخرة لعائلتك ومكتبك في جميع محافظات سلطنة عمان.</p>
          <a className="hero-button" href="#products">اطلب الآن <span>⌑</span></a>
          <div className="hero-stats">
            <span><strong>11</strong><small>محافظة</small></span>
            <span><strong>24+</strong><small>جهة تجارية</small></span>
            <span><strong>✓</strong><small>توصيل مجاني</small></span>
          </div>
        </div>
        <a className="scroll-cue" href="#products">↓</a>
      </section>

      <section className="section band" id="products">
        <div className="section-heading center">
          <h2>تشكيلتنا الفاخرة</h2>
          <p>مصدرها ينابيع طبيعية نقية، كل زجاجة هي وعد بالنقاء.</p>
          <span className="heading-line" />
        </div>
        <div className="product-grid">
          {products.filter((product) => product.active !== false).map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-visual"><img src={product.imageUrl} alt={product.name} /></div>
              <div className="product-copy"><h3>{product.name}</h3><p>{product.desc}</p></div>
              <div className="price-row"><strong>{money(product.price)}</strong><button type="button" onClick={() => addToCart(product.id)}>＋ أضف إلى السلة</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section band aqua-band">
        <div className="section-heading center"><h2>لماذا تختار مياه الواحة؟</h2><p>نحن لا نبيع المياه فحسب — بل نقدم الصحة والنقاء وراحة البال.</p><span className="heading-line" /></div>
        <div className="benefit-grid">
          {benefits.map(([icon, title, text]) => <article className="benefit" key={title}><span className="benefit-icon">{icon}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="section band story-section" id="about">
        <div className="story-media"><video src="https://omanoasis.com/wp-content/uploads/2024/11/WhatsApp-Video-2024-09-05-at-00.05.34_71d84715-2.mp4#t=50,65" muted autoPlay loop playsInline aria-label="مياه الواحة — ممثل الشركة" /></div>
        <div className="story-copy">
          <p className="overline">قصتنا</p><h2>رحلة من النقاء، صُممت لعمان</h2><span className="heading-line right" />
          <p><strong>OASIS OMAN — مياه الواحة</strong> علامة تجارية عُمانية متخصصة في توصيل المياه الأنظف والأكثر نضارة لكل منزل وعمل في عُمان.</p>
          <p>تُستخرج مياهنا من ينابيع طبيعية في جبال الحجر العُمانية، حيث تعمل الصخور كمرشح طبيعي مثالي. نعبئها بعناية للحفاظ على تركيبتها المعدنية وطزاجتها.</p>
          <div className="mission-grid"><div><h4>مهمتنا</h4><p>جعل المياه النقية والآمنة متاحة لكل منزل ومنشأة في عمان.</p></div><div><h4>رؤيتنا</h4><p>أن نكون العلامة التجارية الأكثر ثقة في عمان.</p></div></div>
          <div className="story-stats"><span><strong>4,842+</strong>عميل نثق بهم</span><span><strong>24+</strong>جهة تجارية</span><span><strong>11</strong>محافظة</span></div>
        </div>
      </section>

      <section className="section band aqua-band">
        <div className="section-heading center"><h2>جودة المياه</h2><p>كل قطرة مختبرة، كل دفعة معتمدة.</p><span className="heading-line" /></div>
        <div className="quality-grid">
          {quality.map(([value, title, text]) => <article key={title}><strong>{value}</strong><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="section band delivery-section" id="delivery">
        <div className="section-heading center"><h2>توصيل في جميع أنحاء عمان</h2><p>سريع ومجاني وموثوق — أينما كنت في عمان.</p><span className="heading-line" /></div>
        <div className="delivery-features">
          <article><b>✦</b><h3>توصيل مجاني</h3><p>بدون حد أدنى للطلب.</p></article>
          <article><b>◷</b><h3>في نفس اليوم</h3><p>للطلبات قبل الظهر في مسقط.</p></article>
          <article><b>▣</b><h3>توصيل مجدول</h3><p>اختر الوقت المفضل لديك.</p></article>
          <article><b>⌖</b><h3>تتبع مباشر</h3><p>تحديثات عبر واتساب.</p></article>
        </div>
        <div className="delivery-panel">
          <div><h3>نغطي جميع المحافظات</h3><div className="region-grid">{governorates.map((region) => <span key={region}>{region}</span>)}</div><p className="free-banner"><strong>FREE</strong> توصيل مجاني لجميع محافظات وولايات عمان.</p></div>
          <div className="truck-media"><img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80" alt="Delivery truck" /></div>
        </div>
      </section>

      <section className="section band aqua-band testimonials-section">
        <div className="section-heading center"><h2>ما يقوله عملاؤنا</h2><p>موثوق به من قِبل مئات الآلاف من الأسر والمنشآت في عمان.</p><span className="heading-line" /></div>
        <div className="testimonial-grid">{testimonials.map(([quote, name, city]) => <article key={name}><div className="stars">★★★★★</div><p>“{quote}”</p><div className="customer"><span>{name.slice(0,1)}</span><div><strong>{name}</strong><small>{city}</small></div></div></article>)}</div>
      </section>

      <section className="section band faq-section" id="faq">
        <div className="section-heading center"><h2>الأسئلة الشائعة</h2><p>كل ما تحتاج معرفته عن مياه الواحة.</p><span className="heading-line" /></div>
        <div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="section band aqua-band contact-section" id="contact">
        <div className="section-heading center"><h2>تواصل معنا</h2><p>نحن هنا للمساعدة. تواصل معنا في أي وقت.</p><span className="heading-line" /></div>
        <div className="contact-grid">
          <div className="contact-cards">
            <a href="tel:+96893649190"><span>☎</span><div><small>الهاتف</small><strong dir="ltr">+96893649190</strong></div></a>
            <a href="https://wa.me/96893649190"><span>◉</span><div><small>واتساب</small><strong dir="ltr">+96893649190</strong></div></a>
            <a href="mailto:info@omanoasis.com"><span>✉</span><div><small>البريد الإلكتروني</small><strong>info@omanoasis.com</strong></div></a>
            <div><span>⌖</span><div><small>الموقع</small><strong>صندوق بريد 87، الرمز البريدي 124، الرسيل، سلطنة عمان</strong></div></div>
          </div>
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            {sent ? <div className="success-message">شكراً لك. تم استلام رسالتك وسنتواصل معك قريباً.</div> : <>
              <label>اسمك<input placeholder="أدخل اسمك" required /></label>
              <label>البريد الإلكتروني<input type="email" placeholder="your@email.com" required /></label>
              <label>الرسالة<textarea placeholder="كيف يمكننا مساعدتك؟" required /></label>
              <button type="submit">إرسال الرسالة</button>
            </>}
          </form>
        </div>
      </section>

      <footer className="footer" id="policies">
        <div className="footer-grid">
          <div className="footer-brand"><strong>OASIS OMAN</strong><h3>مياه الواحة</h3><p>ترطيب فاخر يوصل في جميع أنحاء عمان.</p></div>
          <div><h3>روابط سريعة</h3><a href="#home">الرئيسية</a><a href="#about">معلومات عنا</a><a href="#contact">اتصل بنا</a><a href="#faq">الأسئلة الشائعة</a></div>
          <div><h3>السياسات</h3><a href="#policies">سياسة الخصوصية</a><a href="#policies">الشروط والأحكام</a><a href="#delivery">سياسة التوصيل</a><a href="#contact">سياسة الاسترجاع</a></div>
          <div><h3>اتصل بنا</h3><p>الرسيل، سلطنة عمان</p><a dir="ltr" href="tel:+96893649190">+96893649190</a><a href="mailto:info@omanoasis.com">info@omanoasis.com</a><a href="/admin">لوحة الإدارة</a></div>
        </div>
        <p className="copyright">© 2026 OASIS OMAN — مياه الواحة. جميع الحقوق محفوظة.</p>
      </footer>

      <a className="floating-support" href="https://wa.me/96893649190" aria-label="فتح الدعم"><span>♧</span><b>كيف يمكننا مساعدتك؟</b></a>
      {orderConfirmed && <div className="order-toast" role="status"><strong>تم استلام طلبك</strong><span>سيتم التواصل معك لتأكيد التوصيل.</span></div>}

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header"><h2>سلة التسوق</h2><button type="button" onClick={() => setCartOpen(false)}>×</button></div>
        {cartItems.length === 0 ? <div className="empty-cart"><strong>سلتك فارغة</strong><p>أضف بعض المنتجات للمتابعة.</p></div> : <><div className="cart-items">{cartItems.map((item) => <div className="cart-item" key={item.id}><img src={item.imageUrl} alt="" /><div className="cart-copy"><strong>{item.name}</strong><span>{money(item.price)}</span></div><div className="quantity"><button type="button" onClick={() => updateQuantity(item.id,-1)}>−</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id,1)}>＋</button></div></div>)}</div><div className="cart-total"><span>المجموع</span><strong>{money(total)}</strong></div><button className="checkout-button" type="button" onClick={() => {setCartOpen(false);setCheckoutOpen(true);}}>إتمام الطلب</button></>}
      </aside></div>}

      {checkoutOpen && <div className="drawer-backdrop" onClick={() => setCheckoutOpen(false)}><aside className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header"><div><h2>معلومات التوصيل</h2><p>أدخل بياناتك وسنوصل الطلب إلى بابك.</p></div><button type="button" onClick={() => setCheckoutOpen(false)}>×</button></div>
        <form className="checkout-grid" onSubmit={submitOrder}><label>الاسم الكامل<input name="customer" placeholder="أدخل اسمك" required /></label><label>رقم الهاتف<input name="phone" dir="ltr" placeholder="+968 XXXX XXXX" required /></label><label>البريد الإلكتروني<input name="email" type="email" placeholder="your@email.com" required /></label><label>المحافظة<select name="governorate" defaultValue="" required><option value="" disabled>اختر المحافظة</option>{governorates.map((region)=><option key={region}>{region}</option>)}</select></label><label className="wide">عنوان التوصيل<textarea name="address" placeholder="الشارع، المبنى، المنطقة..." required /></label><div className="order-summary wide"><span>{count} منتجات</span><strong>{money(total)}</strong></div><button className="checkout-button wide" type="submit">تأكيد الطلب</button><p className="free-note wide">التوصيل مجاني لجميع محافظات سلطنة عمان.</p></form>
      </aside></div>}
    </main>
  );
}
