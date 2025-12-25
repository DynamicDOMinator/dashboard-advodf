import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage({ searchParams }) {
  const redirect = searchParams?.redirect || "/admin";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fff7e6] via-[#f2d28b] to-[#b8860b]">
      <div className="w-full max-w-md card p-5 sm:p-6">
        <h1 className="text-2xl font-semibold mb-4">تسجيل دخول الإدارة</h1>
        <Suspense fallback={<div>...جاري التحميل</div>}>
          <LoginForm redirect={redirect} />
        </Suspense>
      </div>
    </div>
  );
}
