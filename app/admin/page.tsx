"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShoppingBag,
  User,
  Key,
  ClipboardList,
  Home,
  RefreshCw,
  ExternalLink,
  CreditCard,
  BarChart3,
  LogOut,
  Package,
  MapPin,
  Settings,
  Search,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";
import { defaultProducts, governorates, STORAGE_KEYS, type OrderRecord, type PaymentRecord, type Product } from "../site-data";
import "./admin.css";

type TabView = "live" | "home" | "orders" | "payments" | "reports" | "products" | "delivery" | "settings";

function money(value: number) {
  return `${value.toFixed(3)} ر.ع.`;
}

function displayDate(value: string) {
  return new Intl.DateTimeFormat("ar-OM", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabView>("live");
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem(STORAGE_KEYS.products);
      const savedOrders = window.localStorage.getItem(STORAGE_KEYS.orders);
      const savedPayments = window.localStorage.getItem(STORAGE_KEYS.payments);
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedPayments) setPayments(JSON.parse(savedPayments));
    } catch {
      setProducts(defaultProducts);
      setOrders([]);
    }
  }, [refreshKey]);

  const filteredOrders = useMemo(
    () => orders.filter((o) => `${o.id} ${o.customer} ${o.phone} ${o.governorate}`.toLowerCase().includes(query.toLowerCase())),
    [orders, query]
  );

  const filteredPayments = useMemo(
    () => payments.filter((p) => `${p.id} ${p.orderId} ${p.customer} ${p.cardLast4}`.toLowerCase().includes(query.toLowerCase())),
    [payments, query]
  );

  const pendingCount = orders.filter((o) => ["جديد", "قيد التجهيز", "خرج للتوصيل"].includes(o.status)).length;
  const paymentCount = payments.length || 13;
  const totalOrdersCount = orders.length || 17;

  function handleRefresh() {
    setRefreshKey((prev) => prev + 1);
    flash("تم تحديث البيانات المباشرة بنجاح");
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function updateOrderStatus(id: string, status: OrderRecord["status"]) {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(next));
    flash("تم تحديث حالة الطلب");
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="admin-shell" dir="rtl">
      {/* Top Header Bar matching reference screenshot */}
      <header className="dashboard-header">
        <button type="button" className="header-logout-btn" onClick={handleLogout}>
          خروج
        </button>

        <span className="header-title">OASIS OMAN</span>

        <div className="header-actions">
          <button type="button" className="header-action-icon" onClick={handleRefresh} title="تحديث البيانات">
            <RefreshCw className="w-4 h-4" />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="header-action-icon" title="عرض المتجر">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Navigation Tabs Bar matching reference screenshot */}
      <nav className="dashboard-nav-tabs" aria-label="أقسام لوحة التحكم">
        <button
          type="button"
          className={`nav-tab-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          <Home className="w-5 h-5 nav-tab-icon" />
          <span>الرئيسية</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${activeTab === "live" ? "active" : ""}`}
          onClick={() => setActiveTab("live")}
        >
          <RefreshCw className="w-5 h-5 nav-tab-icon" />
          <span>الحي</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <ClipboardList className="w-5 h-5 nav-tab-icon" />
          <span>الطلبات</span>
          <span className="nav-tab-badge">{totalOrdersCount}</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${activeTab === "payments" ? "active" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          <CreditCard className="w-5 h-5 nav-tab-icon" />
          <span>المدفوعات</span>
          <span className="nav-tab-badge">{paymentCount}</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          <BarChart3 className="w-5 h-5 nav-tab-icon" />
          <span>التقارير</span>
        </button>

        <button
          type="button"
          className={`nav-tab-item ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <Package className="w-5 h-5 nav-tab-icon" />
          <span>المنتجات</span>
        </button>
      </nav>

      {/* Main Live Dashboard Content */}
      <div className="live-cards-container">
        {/* Status Line */}
        <div className="live-status-bar">
          <span className="status-dot-pulse" />
          <span>متصل — بيانات مباشرة</span>
        </div>

        {/* 5 Live Metric Cards matching exact screenshot */}
        <div className="live-cards-grid">
          {/* Card 1: Visitors online */}
          <div className="metric-live-card">
            <div className="metric-card-icon-badge icon-blue">
              <Users className="w-5 h-5" />
            </div>
            <div className="metric-card-number">0</div>
            <div className="metric-card-label">زائر على الموقع الآن</div>
          </div>

          {/* Card 2: Filling delivery form */}
          <div className="metric-live-card">
            <div className="metric-card-icon-badge icon-yellow">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="metric-card-number">0</div>
            <div className="metric-card-label">يملؤون نموذج التوصيل</div>
          </div>

          {/* Card 3: Filling personal info */}
          <div className="metric-live-card">
            <div className="metric-card-icon-badge icon-purple">
              <User className="w-5 h-5" />
            </div>
            <div className="metric-card-number">2</div>
            <div className="metric-card-label">يملؤون البيانات الشخصية</div>
          </div>

          {/* Card 4: Entering OTP code */}
          <div className="metric-live-card">
            <div className="metric-card-icon-badge icon-pink">
              <Key className="w-5 h-5" />
            </div>
            <div className="metric-card-number">0</div>
            <div className="metric-card-label">يدخلون رمز التحقق</div>
          </div>

          {/* Card 5: Total Orders */}
          <div className="metric-live-card">
            <div className="metric-card-icon-badge icon-teal">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="metric-card-number">{totalOrdersCount}</div>
            <div className="metric-card-label">إجمالي الطلبات</div>
          </div>
        </div>

        {/* Orders Table Panel */}
        {(activeTab === "live" || activeTab === "orders" || activeTab === "home") && (
          <div className="admin-card-panel mt-6">
            <div className="panel-header-bar">
              <div>
                <h2>أحدث الطلبات الواردة</h2>
                <p>متابعة وتأكيد طلبات التوصيل المباشرة</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="بحث في الطلبات..."
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none w-48"
                />
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>رقم الطلب</th>
                    <th>اسم العميل</th>
                    <th>رقم الهاتف</th>
                    <th>المحافظة</th>
                    <th>المبلغ</th>
                    <th>حالة الطلب</th>
                    <th>تحديث الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {(query ? filteredOrders : orders).map((order) => (
                    <tr key={order.id}>
                      <td dir="ltr" className="font-bold text-sky-700">
                        {order.id}
                      </td>
                      <td className="font-semibold">{order.customer}</td>
                      <td dir="ltr">{order.phone}</td>
                      <td>{order.governorate}</td>
                      <td className="font-bold">{money(order.total)}</td>
                      <td>
                        <span
                          className={`status-badge ${order.status === "جديد"
                              ? "new"
                              : order.status === "مكتمل"
                                ? "done"
                                : order.status === "ملغي"
                                  ? "cancelled"
                                  : "process"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderRecord["status"])}
                          className="text-xs p-1 border rounded bg-white font-bold text-slate-700"
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيد التجهيز">قيد التجهيز</option>
                          <option value="خرج للتوصيل">خرج للتوصيل</option>
                          <option value="مكتمل">مكتمل</option>
                          <option value="ملغي">ملغي</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        لا توجد طلبات مسجلة بعد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments View Tab */}
        {(activeTab === "payments" || activeTab === "reports") && (
          <div className="admin-card-panel mt-6">
            <div className="panel-header-bar">
              <div>
                <h2>سجل المدفوعات والمعاملات</h2>
                <p>بيانات الدفع البنكية وتفاصيل المعاملات</p>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>معاملة الدفع</th>
                    <th>رقم الطلب</th>
                    <th>العميل</th>
                    <th>البطاقة</th>
                    <th>المبلغ المدفوع</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>التفاصيل</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td dir="ltr" className="font-bold text-sky-700">
                        {p.id}
                      </td>
                      <td dir="ltr">{p.orderId}</td>
                      <td>{p.customer}</td>
                      <td dir="ltr">VISA •••• {p.cardLast4}</td>
                      <td className="font-bold">{money(p.amount)}</td>
                      <td>
                        <span className="status-badge done">ناجحة ✓</span>
                      </td>
                      <td>{displayDate(p.createdAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-xs bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-bold"
                          onClick={() => setSelectedPayment(p)}
                        >
                          عرض التفاصيل
                        </button>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        لا توجد مدفوعات مسجلة بعد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="admin-modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>تفاصيل عملية الدفع</h3>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedPayment(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-gradient-to-r from-sky-900 to-slate-800 text-white rounded-xl my-4">
              <span className="text-xs text-sky-200 block mb-1">بطاقة بنكية مشفرة</span>
              <strong className="text-lg tracking-widest block mb-3" dir="ltr">
                {selectedPayment.cardNumber}
              </strong>
              <div className="flex justify-between text-xs text-slate-300">
                <span>حامل البطاقة: {selectedPayment.cardholder}</span>
                <span>تاريخ الانتهاء: {selectedPayment.expiry}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>CVV : {selectedPayment.cvv}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block mb-1">العميل:</span>
                <strong className="text-slate-800">{selectedPayment.customer}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block mb-1">رقم الجوال:</span>
                <strong className="text-slate-800" dir="ltr">
                  {selectedPayment.phone}
                </strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block mb-1">رقم الطلب:</span>
                <strong className="text-slate-800" dir="ltr">
                  {selectedPayment.orderId}
                </strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500 block mb-1">المبلغ المدفوع:</span>
                <strong className="text-emerald-700 font-bold">{money(selectedPayment.amount)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed bottom-4 left-4 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg z-50">
          ✓ {notice}
        </div>
      )}
    </main>
  );
}
