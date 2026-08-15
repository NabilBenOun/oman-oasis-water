const products = [
  {
    size: "330 ml",
    title: "عبوة يومية",
    en: "Daily bottle",
    detail: "صندوق 24 عبوة للمكاتب والضيافة",
    price: "2.400 OMR",
  },
  {
    size: "500 ml",
    title: "عبوة العائلة",
    en: "Family bottle",
    detail: "مناسبة للمنزل والرحلات والتجمعات",
    price: "3.200 OMR",
  },
  {
    size: "1.5 L",
    title: "العبوة الكبيرة",
    en: "Large bottle",
    detail: "صندوق 12 عبوة للاستخدام اليومي",
    price: "2.900 OMR",
  },
  {
    size: "19 L",
    title: "جالون المبرد",
    en: "Cooler bottle",
    detail: "تبديل واسترجاع للجالونات الفارغة",
    price: "1.300 OMR",
  },
];

const steps = [
  "اختر حجم المياه والكمية",
  "حدد المحافظة ووقت التوصيل",
  "يصلك السائق برسالة تأكيد",
];

const regions = [
  "مسقط",
  "ظفار",
  "الداخلية",
  "شمال الباطنة",
  "جنوب الباطنة",
  "الشرقية",
  "البريمي",
  "مسندم",
];

const faqs = [
  {
    q: "هل يوجد توصيل في نفس اليوم؟",
    a: "نعم داخل مسقط للطلبات المؤكدة قبل الساعة 12 ظهرا. المحافظات الأخرى عادة خلال يوم إلى يومين عمل.",
  },
  {
    q: "هل أستطيع الاشتراك شهريا؟",
    a: "نعم، يمكن جدولة توصيل أسبوعي أو شهري للمنازل والشركات مع كمية ثابتة أو مرنة.",
  },
  {
    q: "هل الجالونات قابلة للاسترجاع؟",
    a: "نستلم الجالونات الفارغة عند التسليم التالي ونحافظ على دورة نظيفة ومنظمة.",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Oasis Oman Water home">
          <span className="brand-mark">و</span>
          <span>
            <strong>مياه الواحة</strong>
            <small>Oasis Oman Water</small>
          </span>
        </a>
        <div className="nav-links">
          <a href="#products">المنتجات</a>
          <a href="#delivery">التوصيل</a>
          <a href="#faq">الأسئلة</a>
          <a href="#contact">تواصل</a>
        </div>
        <a className="nav-cta" href="https://wa.me/96800000000">
          اطلب الآن
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">توصيل مياه معبأة في سلطنة عمان</p>
          <h1>مياه نقية تصل إلى بابك، كل يوم.</h1>
          <p className="hero-text">
            تجربة طلب سريعة للمنازل والشركات، مع عبوات متعددة الأحجام وتوصيل
            منظم في مسقط وباقي المحافظات.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#order">
              ابدأ الطلب
            </a>
            <a className="secondary-button" href="#products">
              عرض الأحجام
            </a>
          </div>
          <div className="trust-row" aria-label="Service highlights">
            <span>معتمدة للشرب</span>
            <span>توصيل مجدول</span>
            <span>دفع آمن</span>
          </div>
        </div>
        <div className="hero-media" aria-label="Premium bottled water products">
          <img src="/hero-water.png" alt="عبوات مياه معبأة بأحجام مختلفة" />
        </div>
      </section>

      <section className="stats-band" aria-label="Company metrics">
        <div>
          <strong>11</strong>
          <span>محافظة نخدمها</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>تأكيد سريع للطلبات</span>
        </div>
        <div>
          <strong>4</strong>
          <span>أحجام رئيسية</span>
        </div>
        <div>
          <strong>7/7</strong>
          <span>خدمة عملاء يومية</span>
        </div>
      </section>

      <section className="section" id="products">
        <div className="section-heading">
          <p className="eyebrow">منتجاتنا</p>
          <h2>الأحجام المطلوبة للبيت، المكتب، والفعاليات.</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.size}>
              <div className="bottle-symbol" aria-hidden="true">
                <span>{product.size}</span>
              </div>
              <h3>{product.title}</h3>
              <p className="product-en">{product.en}</p>
              <p>{product.detail}</p>
              <div className="price-row">
                <strong>{product.price}</strong>
                <a href="#order">إضافة</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="order-section" id="order">
        <div className="order-copy">
          <p className="eyebrow">طريقة الطلب</p>
          <h2>ثلاث خطوات، ومياهك في الطريق.</h2>
          <div className="steps">
            {steps.map((step, index) => (
              <div className="step" key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
        <form className="order-card">
          <label>
            الاسم الكامل
            <input type="text" placeholder="اكتب اسمك" />
          </label>
          <label>
            رقم الهاتف
            <input type="tel" placeholder="+968" />
          </label>
          <label>
            المحافظة
            <select defaultValue="">
              <option value="" disabled>
                اختر المحافظة
              </option>
              {regions.map((region) => (
                <option key={region}>{region}</option>
              ))}
            </select>
          </label>
          <label>
            ملاحظات الطلب
            <textarea placeholder="مثال: 4 صناديق 500 ml وجالونين 19 L" />
          </label>
          <button type="button">إرسال عبر واتساب</button>
        </form>
      </section>

      <section className="delivery" id="delivery">
        <div>
          <p className="eyebrow">التغطية</p>
          <h2>توصيل مرن في عمان.</h2>
          <p>
            ننسق مسارات التوصيل حسب المحافظة والوقت المناسب لك، مع إشعار قبل
            وصول السائق وخيارات اشتراك للشركات.
          </p>
        </div>
        <div className="region-grid">
          {regions.map((region) => (
            <span key={region}>{region}</span>
          ))}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-heading">
          <p className="eyebrow">الأسئلة الشائعة</p>
          <h2>إجابات سريعة قبل الطلب.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div>
          <p className="eyebrow">تواصل معنا</p>
          <h2>جاهزون لتجهيز طلبك القادم.</h2>
          <p>
            WhatsApp: +968 0000 0000
            <br />
            Email: orders@oasisoman.example
            <br />
            Muscat, Sultanate of Oman
          </p>
        </div>
        <a className="primary-button" href="https://wa.me/96800000000">
          فتح واتساب
        </a>
      </section>
    </main>
  );
}
