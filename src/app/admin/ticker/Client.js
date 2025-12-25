"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

export default function TickerClient() {
  const [textEn, setTextEn] = useState("");
  const [textAr, setTextAr] = useState("");
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await apiJson("/api/ticker");
      if (mounted && res.ok && res.data) {
        setCurrent(res.data);
        setTextEn(res.data.text_en || "");
        setTextAr(res.data.text_ar || "");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const body = { text_en: textEn, text_ar: textAr };
    const res = await apiJson("/api/ticker", { method: "POST", body });
    setSaving(false);
    if (res.ok) {
      setCurrent(res.data);
      setMsg("Saved");
    } else {
      setMsg("Error");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">شريط الشركات (نص)</h1>
      {current && (
        <div className="card p-4">
          <div className="text-sm">الحالي</div>
          <div className="text-sm">EN: {current.text_en}</div>
          <div className="text-sm">AR: {current.text_ar}</div>
        </div>
      )}
      <form onSubmit={save} className="card p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              النص (إنجليزي)
            </label>
            <input
              className="input"
              value={textEn}
              onChange={(e) => setTextEn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              النص (عربي)
            </label>
            <input
              className="input"
              value={textAr}
              onChange={(e) => setTextAr(e.target.value)}
              required
            />
          </div>
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
