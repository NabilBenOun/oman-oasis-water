"use client";

import { FormEvent, useState } from "react";
import "./login.css";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next?.startsWith("/admin") ? next : "/admin";
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "تعذر تسجيل الدخول. حاول مرة أخرى.");
      setLoading(false);
    }
  }

  return (
    <main className="admin-login" dir="rtl">
      <section className="login-brand-panel">
        <a className="login-brand" href="/">
          <span>ق</span>
          <div><strong>OASIS OMAN</strong><small>مياه الواحة العمانية</small></div>
        </a>
        <div className="login-brand-copy">
          <span className="login-eyebrow">بوابة الإدارة</span>
          <h1>إدارة المتجر<br />بكل وضوح.</h1>
          <p>تابع الطلبات والمدفوعات والمنتجات من مكان واحد.</p>
        </div>
        <small className="login-copyright">Oasis Oman Water</small>
      </section>

      <section className="login-form-panel">
        <form className="login-form" onSubmit={submit}>
          <div className="login-mobile-brand"><span>ق</span><strong>OASIS OMAN</strong></div>
          <header><span>دخول آمن</span><h2>تسجيل دخول المدير</h2><p>أدخل بيانات الإدارة للوصول إلى لوحة التحكم.</p></header>

          <label>
            اسم المستخدم
            <div className="login-input"><span aria-hidden="true">@</span><input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="اسم المستخدم" required autoFocus /></div>
          </label>
          <label>
            كلمة المرور
            <div className="login-input"><span aria-hidden="true">●</span><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="كلمة المرور" required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showPassword ? "إخفاء" : "إظهار"}</button></div>
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" type="submit" disabled={loading}>{loading ? "جارٍ التحقق..." : "دخول إلى لوحة الإدارة"}<span aria-hidden="true">←</span></button>
          <a className="login-store-link" href="/">العودة إلى المتجر</a>
        </form>
      </section>
    </main>
  );
}
