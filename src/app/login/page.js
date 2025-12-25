"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiJson } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
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
      const redirect = search.get("redirect") || "/admin";
      router.replace(redirect);
    } catch (err) {
      setError("خطأ في الشبكة");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fff7e6] via-[#f2d28b] to-[#b8860b]">
      <div className="w-full max-w-md card p-5 sm:p-6">
        <h1 className="text-2xl font-semibold mb-4">تسجيل دخول الإدارة</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              البريد الإلكتروني
            </label>
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
            <label className="block text-sm font-medium mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
