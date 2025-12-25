"use client";

import { useState, useEffect } from "react";
import { apiJson } from "@/lib/api";
import SafeImage from "@/components/SafeImage";

export default function PopupClient() {
  const [image, setImage] = useState(null);
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await apiJson("/api/popup");
      if (mounted && res.ok) {
        setCurrent(res.data || null);
        if (res.data && typeof res.data.enabled === "boolean") {
          setEnabled(res.data.enabled);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    const form = new FormData();
    if (image) form.append("image", image);
    form.append("enabled", String(enabled));
    const res = await apiJson("/api/popup", { method: "POST", body: form });
    setSaving(false);
    if (res.ok) {
      setMsg("Saved");
      setImage(null);
      setCurrent(res.data);
    } else {
      setMsg("Error");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">النافذة</h1>
      {current && (
        <div className="card p-4 space-y-2">
          <div className="text-sm">الحالي</div>
          <div className="flex items-center gap-4">
            <SafeImage
              src={current.imageUrl}
              alt=""
              width={192}
              height={128}
              className="w-48 h-32 object-cover rounded border"
            />
            <div className="text-sm">مفعل: {String(current.enabled)}</div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">الصورة</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="enabled"
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <label htmlFor="enabled">مفعل</label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
        {msg && (
          <div className="text-sm">
            {msg === "Saved" ? "تم الحفظ" : msg === "Error" ? "حدث خطأ" : msg}
          </div>
        )}
      </form>
    </div>
  );
}
