export default function AdminHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">لوحة التحكم</h1>
      <p className="text-muted">إدارة النافذة والأنشطة والرحلات.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/popup" className="card p-4 hover:shadow transition">
          النافذة
        </a>
        <a
          href="/admin/activities"
          className="card p-4 hover:shadow transition"
        >
          الأنشطة
        </a>
        <a href="/admin/trips" className="card p-4 hover:shadow transition">
          الرحلات
        </a>
      </div>
    </div>
  );
}
