"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api";
import SafeImage from "@/components/SafeImage";
import Image from "next/image";

export default function PartnersClient() {
  const [items, setItems] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await apiJson("/api/partners");
      if (mounted && res.ok) setItems(res.data || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const previews = useMemo(() => {
    return selectedFiles.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
  }, [selectedFiles]);
  useEffect(() => {
    return () => {
      previews.forEach((u) => URL.revokeObjectURL(u.url));
    };
  }, [previews]);

  async function remove(id) {
    const res = await apiJson(`/api/partners/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((x) => x._id !== id));
  }

  function addFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...files]);
  }

  function removeFile(index) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function save(e) {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;
    setSaving(true);
    setMsg("");
    const form = new FormData();
    let res;
    if (selectedFiles.length === 1) {
      form.append("image", selectedFiles[0]);
      res = await apiJson("/api/partners", { method: "POST", body: form });
    } else {
      for (const f of selectedFiles) form.append("images", f);
      res = await apiJson("/api/partners/bulk", {
        method: "POST",
        body: form,
      });
    }
    setSaving(false);
    if (res.ok) {
      if (Array.isArray(res.data)) {
        setItems((prev) => [...res.data, ...prev]);
      } else {
        setItems((prev) => [res.data, ...prev]);
      }
      setSelectedFiles([]);
      setMsg("Saved");
    } else {
      setMsg("Error");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">شركاؤنا (الشعارات)</h1>

      <form onSubmit={save} className="card p-4 space-y-4">
        <div className="text-lg font-medium">رفع شعارات</div>
        <div>
          <label className="block text-sm font-medium mb-1">الصور</label>
          <input type="file" accept="image/*" multiple onChange={addFiles} />
        </div>
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((p, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={p.url}
                  alt=""
                  width={240}
                  height={120}
                  className="w-full h-20 object-contain rounded border bg-card"
                  unoptimized
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7"
                  onClick={() => removeFile(idx)}
                  aria-label="إزالة"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
        {msg && (
          <div className="text-sm">
            {msg === "Saved" ? "تم الحفظ" : msg === "Error" ? "حدث خطأ" : msg}
          </div>
        )}
      </form>

      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">الشركاء الموجودون</h2>
        {items.length === 0 && <div>لا توجد شعارات</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="card p-3">
              <SafeImage
                src={item.imageUrl}
                alt=""
                width={240}
                height={120}
                className="w-full h-20 object-contain rounded border mb-2 bg-card"
              />
              <button
                className="btn bg-red-600 text-white"
                onClick={() => remove(item._id)}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
