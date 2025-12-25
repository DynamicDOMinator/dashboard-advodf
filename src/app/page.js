import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7e6] via-[#f2d28b] to-[#b8860b] text-white">
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-2xl w-full text-center space-y-5 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            مرحبًا بك في لوحة إدارة المغامرة
          </h1>
          <p className="text-base sm:text-lg text-white/90">
            إدارة النافذة والأنشطة والرحلات بسهولة وواجهة حديثة.
          </p>
          <div className="flex items-center justify-center">
            <Link href="/login" className="btn btn-primary text-center">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
