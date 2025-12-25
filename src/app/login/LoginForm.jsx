"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/lib/api";

export default function LoginForm({ redirect }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiJson("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (!res.ok || !res.data?.token) {
        setError(res.data?.message || "فشل تسجيل الدخول");
        setLoading(false);
        return;
      }
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `token=${encodeURIComponent(
        res.data.token
      )}; Path=/; Max-Age=${maxAge}`;
      router.replace(redirect || "/admin");
    } catch (err) {
      setError("خطأ في الشبكة");
      setLoading(false);
    }
  }

  return (
    <>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            className="input"
            placeholder="admin@site.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">كلمة المرور</label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full btn btn-primary" disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
        </button>
      </form>
    </>
  );
}
