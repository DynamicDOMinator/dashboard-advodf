"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { getToken } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function logout() {
    document.cookie = "token=; Path=/; Max-Age=0";
    router.replace("/login");
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block border-r border-border bg-card">
          <div className="h-16 flex items-center px-4 border-b border-border">
            <Link href="/admin" className="text-lg font-semibold">
              لوحة التحكم
            </Link>
          </div>
          <nav className="px-3 py-4 space-y-1">
            <Link
              href="/admin"
              className={`block px-3 py-2 rounded-[var(--radius-md)] ${
                pathname === "/admin"
                  ? "bg-brand text-brand-foreground"
                  : "nav-link"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              href="/admin/popup"
              className={`block px-3 py-2 rounded-[var(--radius-md)] ${
                pathname.startsWith("/admin/popup")
                  ? "bg-brand text-brand-foreground"
                  : "nav-link"
              }`}
            >
              النافذة
            </Link>
            <Link
              href="/admin/activities"
              className={`block px-3 py-2 rounded-[var(--radius-md)] ${
                pathname.startsWith("/admin/activities") &&
                !pathname.includes("/hero")
                  ? "bg-brand text-brand-foreground"
                  : "nav-link"
              }`}
            >
              الأنشطة
            </Link>
            <Link
              href="/admin/ticker"
              className={`block px-3 py-2 rounded-[var(--radius-md)] ${
                pathname.startsWith("/admin/ticker")
                  ? "bg-brand text-brand-foreground"
                  : "nav-link"
              }`}
            >
              شريط الشركات
            </Link>
            <Link
              href="/admin/partners"
              className={`block px-3 py-2 rounded-[var(--radius-md)] ${
                pathname.startsWith("/admin/partners")
                  ? "bg-brand text-brand-foreground"
                  : "nav-link"
              }`}
            >
              الشركاء
            </Link>
            <Link
              href="/admin/trips"
              className={`block px-3 py-2 rounded-[var(--radius-md)] ${
                pathname.startsWith("/admin/trips")
                  ? "bg-brand text-brand-foreground"
                  : "nav-link"
              }`}
            >
              الرحلات
            </Link>
          </nav>
        </aside>
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 h-16 border-b border-border bg-card">
            <div className="max-w-6xl mx-auto px-2 sm:px-4 h-full flex items-center justify-between">
              <div className="flex items-center gap-2 md:hidden">
                <Link href="/admin" className="text-lg font-semibold">
                  لوحة التحكم
                </Link>
                <button
                  aria-label="فتح القائمة"
                  aria-expanded={mobileOpen}
                  className="btn btn-outline"
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  {mobileOpen ? "✕" : "☰"}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex">
                  <ThemeToggle />
                </span>
                <button
                  onClick={logout}
                  className="hidden sm:inline-flex btn btn-outline"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </header>
          <div
            className={`md:hidden fixed top-16 bottom-0 right-0 z-50 w-64 bg-card border-l border-border shadow-lg transform transition-transform duration-200 ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <nav className="px-3 py-3 text-sm flex flex-col gap-2">
              <Link
                href="/admin"
                className={`block ${
                  pathname === "/admin" ? "nav-link-active" : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/admin/popup"
                className={`block ${
                  pathname.startsWith("/admin/popup")
                    ? "nav-link-active"
                    : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                النافذة
              </Link>
              <Link
                href="/admin/activities"
                className={`block ${
                  pathname.startsWith("/admin/activities") &&
                  !pathname.includes("/hero")
                    ? "nav-link-active"
                    : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                الأنشطة
              </Link>
              <Link
                href="/admin/ticker"
                className={`block ${
                  pathname.startsWith("/admin/ticker")
                    ? "nav-link-active"
                    : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                شريط الشركات
              </Link>
              <Link
                href="/admin/partners"
                className={`block ${
                  pathname.startsWith("/admin/partners")
                    ? "nav-link-active"
                    : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                الشركاء
              </Link>
              <Link
                href="/admin/trips"
                className={`block ${
                  pathname.startsWith("/admin/trips")
                    ? "nav-link-active"
                    : "nav-link"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                الرحلات
              </Link>
              <button
                className="w-full btn btn-outline mt-2"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
              >
                تسجيل الخروج
              </button>
              <div className="mt-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
          {mobileOpen && (
            <div
              className="md:hidden fixed inset-0 top-16 z-40 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
          )}
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
