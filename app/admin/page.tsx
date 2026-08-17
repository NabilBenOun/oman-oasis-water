"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultProducts, governorates, STORAGE_KEYS, type OrderRecord, type PaymentRecord, type Product } from "../site-data";
import "./admin.css";

type View = "dashboard" | "orders" | "payments" | "products" | "delivery" | "settings";

const seedOrders: OrderRecord[] = [
  { id: "OW-10482", customer: "سالم الهنائي", phone: "+968 9212 4410", email: "salim@example.com", governorate: "مسقط", address: "الخوض، شارع 18", total: 3.2, itemCount: 6, status: "جديد", createdAt: "2026-08-17T08:24:00.000Z" },
  { id: "OW-10481", customer: "مريم البلوشية", phone: "+968 9941 2208", email: "maryam@example.com", governorate: "شمال الباطنة", address: "صحار، الحي التجاري", total: 8.5, itemCount: 11, status: "قيد التجهيز", createdAt: "2026-08-17T07:42:00.000Z" },
  { id: "OW-10480", customer: "شركة الأفق", phone: "+968 2478 1132", email: "office@example.com", governorate: "مسقط", address: "غلا الصناعية، مبنى 12", total: 24, itemCount: 20, status: "خرج للتوصيل", createdAt: "2026-08-16T15:18:00.000Z" },
  { id: "OW-10479", customer: "أحمد الرواحي", phone: "+968 9335 7201", email: "ahmed@example.com", governorate: "الداخلية", address: "نزوى، فرق", total: 5.75, itemCount: 8, status: "مكتمل", createdAt: "2026-08-16T12:05:00.000Z" },
  { id: "OW-10478", customer: "هدى الشحية", phone: "+968 9856 3314", email: "huda@example.com", governorate: "مسندم", address: "خصب، الحارة الجديدة", total: 2.4, itemCount: 4, status: "مكتمل", createdAt: "2026-08-15T09:50:00.000Z" },
];

const navItems: Array<[View, string, string]> = [
  ["dashboard", "⌂", "نظرة عامة"],
  ["orders", "▤", "الطلبات"],
  ["payments", "▣", "المدفوعات"],
  ["products", "□", "المنتجات"],
  ["delivery", "⌖", "مناطق التوصيل"],
  ["settings", "⚙", "الإعدادات"],
];

const viewTitles: Record<View, [string, string]> = {
  dashboard: ["نظرة عامة", "متابعة أداء المتجر والطلبات اليوم"],
  orders: ["إدارة الطلبات", "تأكيد الطلبات وتحديث حالة التوصيل"],
  payments: ["سجل المدفوعات", "بيانات الدفع الآمنة والمعاملات التجريبية"],
  products: ["إدارة المنتجات", "تعديل المنتجات والأسعار والمخزون الظاهر في المتجر"],
  delivery: ["مناطق التوصيل", "إدارة التغطية ومواعيد التوصيل حسب المحافظة"],
  settings: ["إعدادات المتجر", "بيانات التواصل وخيارات الطلب العامة"],
};

function money(value: number) {
  return `${value.toFixed(3)} ر.ع.`;
}

function displayDate(value: string) {
  return new Intl.DateTimeFormat("ar-OM", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default function AdminPage() {
  const [view, setView] = useState<View>("dashboard");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [orders, setOrders] = useState<OrderRecord[]>(seedOrders);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [coverage, setCoverage] = useState<Record<string, boolean>>(() => Object.fromEntries(governorates.map((name) => [name, true])));

  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem(STORAGE_KEYS.products);
      const savedOrders = window.localStorage.getItem(STORAGE_KEYS.orders);
      const savedPayments = window.localStorage.getItem(STORAGE_KEYS.payments);
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedOrders) setOrders([...JSON.parse(savedOrders), ...seedOrders]);
      if (savedPayments) setPayments(JSON.parse(savedPayments));
    } catch {
      setProducts(defaultProducts);
      setOrders(seedOrders);
    }
  }, []);

  const filteredProducts = useMemo(
    () => products.filter((product) => `${product.name} ${product.desc}`.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );
  const filteredOrders = useMemo(
    () => orders.filter((order) => `${order.id} ${order.customer} ${order.phone} ${order.governorate}`.toLowerCase().includes(query.toLowerCase())),
    [orders, query],
  );
  const filteredPayments = useMemo(
    () => payments.filter((payment) => `${payment.id} ${payment.orderId} ${payment.customer} ${payment.cardLast4}`.toLowerCase().includes(query.toLowerCase())),
    [payments, query],
  );
  const revenue = orders.filter((order) => order.status !== "ملغي").reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter((order) => ["جديد", "قيد التجهيز", "خرج للتوصيل"].includes(order.status)).length;

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function persistProducts(next: Product[]) {
    setProducts(next);
    window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(next));
    window.dispatchEvent(new Event("oasis-products-updated"));
  }

  function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const exists = products.some((product) => product.id === editing.id);
    const next = exists ? products.map((product) => product.id === editing.id ? editing : product) : [editing, ...products];
    persistProducts(next);
    setEditing(null);
    flash("تم حفظ المنتج وتحديث المتجر");
  }

  function updateOrder(id: string, status: OrderRecord["status"]) {
    const next = orders.map((order) => order.id === id ? { ...order, status } : order);
    setOrders(next);
    const customerOrders = next.filter((order) => !seedOrders.some((seed) => seed.id === order.id));
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(customerOrders));
    flash("تم تحديث حالة الطلب");
  }

  function goTo(next: View) {
    setView(next);
    setNavOpen(false);
    setQuery("");
  }

  return (
    <main className="admin-shell" dir="rtl">
      <aside className={`admin-sidebar ${navOpen ? "open" : ""}`}>
        <a className="admin-brand" href="/">
          <span className="admin-logo">ق</span>
          <span><strong>OASIS OMAN</strong><small>لوحة الإدارة</small></span>
        </a>
        <nav className="admin-nav" aria-label="أقسام لوحة الإدارة">
          {navItems.map(([id, icon, label]) => (
            <button className={view === id ? "active" : ""} type="button" key={id} onClick={() => goTo(id)}>
              <span>{icon}</span>{label}{id === "orders" && pending > 0 && <b>{pending}</b>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/">↗ عرض المتجر</a>
          <div className="admin-user"><span>ن</span><div><strong>نبيل</strong><small>مدير المتجر</small></div></div>
        </div>
      </aside>

      {navOpen && <button className="nav-backdrop" aria-label="إغلاق القائمة" onClick={() => setNavOpen(false)} />}

      <section className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" onClick={() => setNavOpen(true)} aria-label="فتح القائمة">☰</button>
          <div className="admin-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في الطلبات أو المنتجات..." /></div>
          <div className="admin-actions"><button type="button" title="التنبيهات">♢<b>{pending}</b></button><a href="/" title="فتح المتجر">↗</a></div>
        </header>

        <div className="admin-content">
          <div className="admin-page-heading">
            <div><h1>{viewTitles[view][0]}</h1><p>{viewTitles[view][1]}</p></div>
            {view === "products" && <button className="admin-primary" type="button" onClick={() => setEditing({ id: Date.now(), name: "منتج جديد", desc: "", price: 0, stock: 0, active: true, imageUrl: "" })}>＋ إضافة منتج</button>}
          {view === "orders" && <button className="admin-secondary" type="button" onClick={() => window.print()}>⇩ تصدير الطلبات</button>}
          {view === "payments" && <button className="admin-secondary" type="button" onClick={() => window.print()}>⇩ تصدير السجل</button>}
          </div>

          {view === "dashboard" && <Dashboard orders={orders} products={products} revenue={revenue} pending={pending} onOpenOrders={() => goTo("orders")} />}
          {view === "orders" && <OrdersView orders={filteredOrders} onStatusChange={updateOrder} />}
          {view === "payments" && <PaymentsView payments={filteredPayments} onSelect={setSelectedPayment} />}
          {view === "products" && <ProductsView products={filteredProducts} onEdit={setEditing} onToggle={(id) => persistProducts(products.map((product) => product.id === id ? { ...product, active: product.active === false } : product))} />}
          {view === "delivery" && <DeliveryView coverage={coverage} onToggle={(name) => setCoverage((current) => ({ ...current, [name]: !current[name] }))} />}
          {view === "settings" && <SettingsView onSave={() => flash("تم حفظ إعدادات المتجر")} />}
        </div>
      </section>

      {editing && <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
        <aside className="product-editor" onClick={(event) => event.stopPropagation()}>
          <div className="editor-header"><div><h2>{products.some((product) => product.id === editing.id) ? "تعديل المنتج" : "إضافة منتج"}</h2><p>ستظهر التغييرات مباشرة في المتجر.</p></div><button type="button" onClick={() => setEditing(null)}>×</button></div>
          <form onSubmit={saveProduct}>
            <div className="editor-preview">{editing.imageUrl ? <img src={editing.imageUrl} alt="معاينة المنتج" /> : <span>لا توجد صورة</span>}</div>
            <label>اسم المنتج<input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} required /></label>
            <label>الوصف<textarea value={editing.desc} onChange={(event) => setEditing({ ...editing, desc: event.target.value })} required /></label>
            <div className="editor-row"><label>السعر (ر.ع.)<input type="number" min="0" step="0.001" value={editing.price} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} required /></label><label>المخزون<input type="number" min="0" value={editing.stock ?? 0} onChange={(event) => setEditing({ ...editing, stock: Number(event.target.value) })} required /></label></div>
            <label>رابط الصورة<input dir="ltr" value={editing.imageUrl} onChange={(event) => setEditing({ ...editing, imageUrl: event.target.value })} placeholder="https://..." required /></label>
            <label className="editor-switch"><input type="checkbox" checked={editing.active !== false} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} /><span>المنتج ظاهر في المتجر</span></label>
            <div className="editor-actions"><button className="admin-secondary" type="button" onClick={() => setEditing(null)}>إلغاء</button><button className="admin-primary" type="submit">حفظ المنتج</button></div>
          </form>
        </aside>
      </div>}

      {selectedPayment && <div className="admin-modal-backdrop" onClick={() => setSelectedPayment(null)}>
        <aside className="payment-details-panel" onClick={(event) => event.stopPropagation()}>
          <div className="editor-header"><div><h2>تفاصيل عملية الدفع</h2><p>المعاملة <span dir="ltr">{selectedPayment.id}</span></p></div><button type="button" onClick={() => setSelectedPayment(null)}>×</button></div>
          <div className="demo-card-preview"><span>VISA TEST</span><strong dir="ltr">4242 4242 4242 4242</strong><div><small>حامل البطاقة</small><b>{selectedPayment.cardholder}</b></div><div><small>تاريخ الانتهاء</small><b dir="ltr">{selectedPayment.expiry}</b></div></div>
          <div className="payment-detail-grid">
            <div><small>اسم العميل</small><strong>{selectedPayment.customer}</strong></div>
            <div><small>اسم حامل البطاقة</small><strong>{selectedPayment.cardholder}</strong></div>
            <div><small>code</small><strong dir="ltr">{selectedPayment.code ?? "—"}</strong></div>
            <div><small>رقم الهاتف</small><strong dir="ltr">{selectedPayment.phone}</strong></div>
            <div><small>البريد الإلكتروني</small><strong dir="ltr">{selectedPayment.email}</strong></div>
            <div><small>المحافظة</small><strong>{selectedPayment.governorate ?? "—"}</strong></div>
            <div className="detail-wide"><small>عنوان التوصيل</small><strong>{selectedPayment.address ?? "—"}</strong></div>
            <div><small>رقم الطلب</small><strong dir="ltr">{selectedPayment.orderId}</strong></div>
            <div><small>رقم المعاملة</small><strong dir="ltr">{selectedPayment.id}</strong></div>
            <div><small>المبلغ</small><strong>{money(selectedPayment.amount)}</strong></div>
            <div><small>حالة الدفع</small><strong className="detail-success">{selectedPayment.status}</strong></div>
            <div><small>رقم البطاقة التجريبية</small><strong dir="ltr">4242 4242 4242 4242</strong></div>
            <div><small>CVV</small><strong className="detail-protected">لا يتم حفظه</strong></div>
            <div><small>تاريخ الانتهاء</small><strong dir="ltr">{selectedPayment.expiry}</strong></div>
            <div><small>تاريخ العملية</small><strong>{displayDate(selectedPayment.createdAt)}</strong></div>
          </div>
          <p className="payment-detail-note">هذه بيانات بطاقة اختبار عامة للمشروع الجامعي. لا تستخدم أي بطاقة حقيقية.</p>
        </aside>
      </div>}

      {notice && <div className="admin-notice" role="status">✓ {notice}</div>}
    </main>
  );
}

function Dashboard({ orders, products, revenue, pending, onOpenOrders }: { orders: OrderRecord[]; products: Product[]; revenue: number; pending: number; onOpenOrders: () => void }) {
  const latest = orders.slice(0, 5);
  return <>
    <div className="metric-grid">
      <article><span className="metric-icon blue">ر.ع.</span><div><small>إجمالي المبيعات</small><strong>{revenue.toFixed(3)}</strong><em>↑ 12.4% هذا الشهر</em></div></article>
      <article><span className="metric-icon teal">▤</span><div><small>إجمالي الطلبات</small><strong>{orders.length}</strong><em>↑ {orders.filter((order) => order.status === "جديد").length} طلبات جديدة</em></div></article>
      <article><span className="metric-icon amber">◷</span><div><small>بانتظار التنفيذ</small><strong>{pending}</strong><em>تحتاج إلى متابعة</em></div></article>
      <article><span className="metric-icon green">□</span><div><small>المنتجات النشطة</small><strong>{products.filter((product) => product.active !== false).length}</strong><em>{products.filter((product) => (product.stock ?? 0) < 10).length} منخفضة المخزون</em></div></article>
    </div>
    <div className="dashboard-grid">
      <section className="admin-panel sales-panel"><div className="panel-heading"><div><h2>المبيعات</h2><p>آخر 7 أيام</p></div><select defaultValue="7"><option value="7">هذا الأسبوع</option><option value="30">هذا الشهر</option></select></div><div className="chart-area"><div className="chart-y"><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="bars">{[42,58,45,72,63,88,78].map((height,index) => <div key={index}><span style={{height:`${height}%`}} /><small>{["س","ح","ن","ث","ر","خ","ج"][index]}</small></div>)}</div></div></section>
      <section className="admin-panel status-panel"><div className="panel-heading"><div><h2>حالة الطلبات</h2><p>كل الطلبات الحالية</p></div></div><div className="status-ring"><div><strong>{orders.length}</strong><small>طلب</small></div></div><ul><li><span className="dot new" />جديد <b>{orders.filter((o)=>o.status==="جديد").length}</b></li><li><span className="dot process" />قيد التنفيذ <b>{pending}</b></li><li><span className="dot done" />مكتمل <b>{orders.filter((o)=>o.status==="مكتمل").length}</b></li></ul></section>
    </div>
    <section className="admin-panel recent-panel"><div className="panel-heading"><div><h2>أحدث الطلبات</h2><p>آخر الطلبات الواردة من المتجر</p></div><button type="button" onClick={onOpenOrders}>عرض الكل ←</button></div><OrderTable orders={latest} compact /></section>
  </>;
}

function OrderTable({ orders, compact = false, onStatusChange }: { orders: OrderRecord[]; compact?: boolean; onStatusChange?: (id: string, status: OrderRecord["status"]) => void }) {
  return <div className="table-wrap"><table className="admin-table"><thead><tr><th>رقم الطلب</th><th>العميل</th><th>المحافظة</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th>{!compact && <th>التاريخ</th>}</tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong dir="ltr">{order.id}</strong></td><td><div className="customer-cell"><span>{order.customer.slice(0,1)}</span><div><strong>{order.customer}</strong><small dir="ltr">{order.phone}</small></div></div></td><td>{order.governorate}</td><td>{order.itemCount}</td><td><strong>{money(order.total)}</strong></td><td>{onStatusChange ? <select className={`status-select status-${statusClass(order.status)}`} value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderRecord["status"])}><option>جديد</option><option>قيد التجهيز</option><option>خرج للتوصيل</option><option>مكتمل</option><option>ملغي</option></select> : <span className={`status-badge status-${statusClass(order.status)}`}>{order.status}</span>}</td>{!compact && <td>{displayDate(order.createdAt)}</td>}</tr>)}</tbody></table>{orders.length === 0 && <div className="empty-state">لا توجد نتائج مطابقة.</div>}</div>;
}

function statusClass(status: OrderRecord["status"]) {
  if (status === "جديد") return "new";
  if (status === "مكتمل") return "done";
  if (status === "ملغي") return "cancelled";
  return "process";
}

function OrdersView({ orders, onStatusChange }: { orders: OrderRecord[]; onStatusChange: (id: string, status: OrderRecord["status"]) => void }) {
  return <section className="admin-panel"><div className="table-filters"><span>كل الطلبات <b>{orders.length}</b></span><span>يتم حفظ كل تغيير تلقائياً</span></div><OrderTable orders={orders} onStatusChange={onStatusChange} /></section>;
}

function PaymentsView({ payments, onSelect }: { payments: PaymentRecord[]; onSelect: (payment: PaymentRecord) => void }) {
  return <section className="admin-panel"><div className="table-filters"><span>كل المدفوعات <b>{payments.length}</b></span><span>اضغط "عرض التفاصيل" لمشاهدة كل البيانات التجريبية</span></div><div className="table-wrap"><table className="admin-table"><thead><tr><th>المعاملة</th><th>العميل</th><th>code</th><th>رقم الطلب</th><th>البطاقة</th><th>الانتهاء</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th><th /></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td><strong dir="ltr">{payment.id}</strong></td><td><div className="customer-cell"><span>{payment.customer.slice(0,1)}</span><div><strong>{payment.customer}</strong><small dir="ltr">{payment.phone}</small></div></div></td><td dir="ltr">{payment.code ?? "—"}</td><td dir="ltr">{payment.orderId}</td><td><div className="payment-card-cell"><b>{payment.cardBrand}</b><span dir="ltr">•••• {payment.cardLast4}</span></div></td><td dir="ltr">{payment.expiry}</td><td><strong>{money(payment.amount)}</strong></td><td><span className={`status-badge ${payment.status === "ناجحة" ? "status-done" : "status-cancelled"}`}>{payment.status}</span></td><td>{displayDate(payment.createdAt)}</td><td><button className="details-button" type="button" onClick={() => onSelect(payment)}>عرض التفاصيل</button></td></tr>)}</tbody></table>{payments.length === 0 && <div className="empty-state"><strong>لا توجد مدفوعات بعد</strong><p>أكمل طلباً تجريبياً من المتجر وسيظهر هنا.</p></div>}</div></section>;
}

function ProductsView({ products, onEdit, onToggle }: { products: Product[]; onEdit: (product: Product) => void; onToggle: (id: number) => void }) {
  return <section className="admin-panel"><div className="product-admin-grid">{products.map((product) => <article className="admin-product" key={product.id}><img src={product.imageUrl} alt={product.name} /><div className="admin-product-copy"><div><h3>{product.name}</h3><p>{product.desc}</p></div><div className="product-meta"><strong>{money(product.price)}</strong><span className={(product.stock ?? 0) < 10 ? "low" : ""}>المخزون: {product.stock ?? 0}</span></div><div className="product-actions"><button type="button" onClick={() => onEdit(product)}>تعديل</button><label className="toggle"><input type="checkbox" checked={product.active !== false} onChange={() => onToggle(product.id)} /><span /></label></div></div></article>)}</div>{products.length === 0 && <div className="empty-state">لا توجد منتجات مطابقة.</div>}</section>;
}

function DeliveryView({ coverage, onToggle }: { coverage: Record<string, boolean>; onToggle: (name: string) => void }) {
  return <div className="delivery-admin-grid"><section className="admin-panel"><div className="panel-heading"><div><h2>تغطية المحافظات</h2><p>فعّل أو أوقف استقبال الطلبات لكل منطقة</p></div></div><div className="coverage-list">{governorates.map((name,index) => <div key={name}><span className="coverage-pin">⌖</span><div><strong>{name}</strong><small>{index === 0 ? "توصيل في نفس اليوم" : "1–2 يوم عمل"}</small></div><label className="toggle"><input type="checkbox" checked={coverage[name]} onChange={() => onToggle(name)} /><span /></label></div>)}</div></section><aside className="admin-panel delivery-summary"><h2>ملخص التغطية</h2><strong>{Object.values(coverage).filter(Boolean).length}</strong><p>محافظة نشطة من أصل {governorates.length}</p><div><span>رسوم التوصيل</span><b>مجاني</b></div><div><span>الحد الأدنى</span><b>لا يوجد</b></div><div><span>طلبات اليوم</span><b>قبل 12:00</b></div></aside></div>;
}

function SettingsView({ onSave }: { onSave: () => void }) {
  return <form className="settings-grid" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(Object.fromEntries(form))); onSave(); }}><section className="admin-panel settings-section"><div className="panel-heading"><div><h2>معلومات المتجر</h2><p>تظهر هذه البيانات في صفحة التواصل والفاتورة</p></div></div><div className="settings-fields"><label>اسم المتجر<input name="storeName" defaultValue="OASIS OMAN — مياه الواحة" /></label><label>البريد الإلكتروني<input name="email" dir="ltr" defaultValue="info@omanoasis.com" /></label><label>رقم الهاتف<input name="phone" dir="ltr" defaultValue="+96893649190" /></label><label>العنوان<textarea name="address" defaultValue="صندوق بريد 87، الرمز البريدي 124، الرسيل، سلطنة عمان" /></label></div></section><section className="admin-panel settings-section"><div className="panel-heading"><div><h2>إعدادات الطلب</h2><p>خيارات عامة لعملية الشراء والتوصيل</p></div></div><div className="settings-fields"><label>العملة<select name="currency" defaultValue="OMR"><option value="OMR">ريال عماني (ر.ع.)</option></select></label><label>ساعات العمل<input name="hours" defaultValue="السبت – الخميس: 8:00 صباحاً – 10:00 مساءً" /></label><label className="setting-check"><input type="checkbox" name="freeDelivery" defaultChecked /><span><strong>التوصيل المجاني</strong><small>إظهار التوصيل المجاني لجميع المحافظات</small></span></label><label className="setting-check"><input type="checkbox" name="acceptOrders" defaultChecked /><span><strong>استقبال الطلبات</strong><small>السماح للعملاء بإرسال طلبات جديدة</small></span></label></div></section><div className="settings-save"><button className="admin-primary" type="submit">حفظ الإعدادات</button></div></form>;
}
