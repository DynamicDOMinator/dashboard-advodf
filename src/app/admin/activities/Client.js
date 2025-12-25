"use client";

import { useState, useEffect } from "react";
import { apiJson } from "@/lib/api";
import SafeImage from "@/components/SafeImage";

export default function ActivitiesClient() {
  const [items, setItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [file, setFile] = useState(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [heroImage, setHeroImage] = useState(null);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroCurrent, setHeroCurrent] = useState(null);
  const [heroMsg, setHeroMsg] = useState("");

  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    file: null,
    imgUrl: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await apiJson("/api/activities");
      if (mounted && res.ok) setItems(res.data || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await apiJson("/api/activities/hero");
      if (mounted && res.ok) setHeroCurrent(res.data || null);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function create(e) {
    e.preventDefault();
    setCreating(true);
    const form = new FormData();
    if (file) form.append("image", file);
    form.append("title_en", titleEn);
    form.append("title_ar", titleAr);
    form.append("description_en", descEn);
    form.append("description_ar", descAr);
    const res = await apiJson("/api/activities", {
      method: "POST",
      body: form,
    });
    setCreating(false);
    if (res.ok) {
      setItems((prev) => [res.data, ...prev]);
      setFile(null);
      setTitleEn("");
      setTitleAr("");
      setDescEn("");
      setDescAr("");
    }
  }

  async function remove(id) {
    const res = await apiJson(`/api/activities/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((x) => x._id !== id));
  }

  function startEdit(item) {
    setEditId(item._id);
    setEdit({
      title_en: item.title_en || "",
      title_ar: item.title_ar || "",
      description_en: item.description_en || "",
      description_ar: item.description_ar || "",
      file: null,
      imgUrl: "",
    });
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editId) return;
    setSavingEdit(true);
    const form = new FormData();
    if (edit.file) form.append("image", edit.file);
    if (edit.imgUrl) form.append("imgUrl", edit.imgUrl);
    if (edit.title_en) form.append("title_en", edit.title_en);
    if (edit.title_ar) form.append("title_ar", edit.title_ar);
    if (edit.description_en) form.append("description_en", edit.description_en);
    if (edit.description_ar) form.append("description_ar", edit.description_ar);
    const res = await apiJson(`/api/activities/${editId}`, {
      method: "PUT",
      body: form,
    });
    setSavingEdit(false);
    if (res.ok) {
      setItems((prev) => prev.map((x) => (x._id === editId ? res.data : x)));
      setEditId(null);
    }
  }

  async function saveHero(e) {
    e.preventDefault();
    if (!heroImage) return;
    setHeroSaving(true);
    setHeroMsg("");
    const form = new FormData();
    form.append("image", heroImage);
    const res = await apiJson("/api/activities/hero", {
      method: "POST",
      body: form,
    });
    setHeroSaving(false);
    if (res.ok) {
      setHeroCurrent(res.data);
      setHeroImage(null);
      setHeroMsg("Saved");
    } else {
      setHeroMsg("Error");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">الأنشطة</h1>
      <div className="card p-4 space-y-3">
        <div className="text-lg font-medium">صورة قسم الأنشطة (Hero)</div>
        {heroCurrent && (
          <div className="flex items-center gap-4">
            <SafeImage
              src={heroCurrent.imageUrl}
              alt=""
              width={192}
              height={128}
              className="w-48 h-32 object-cover rounded border"
            />
            <div className="text-sm">
              تم الرفع في:{" "}
              {new Date(
                heroCurrent.updatedAt || heroCurrent.createdAt
              ).toLocaleString()}
            </div>
          </div>
        )}
        <form onSubmit={saveHero} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">الصورة</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHeroImage(e.target.files?.[0] || null)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={heroSaving}>
            {heroSaving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
          {heroMsg && (
            <div className="text-sm">
              {heroMsg === "Saved"
                ? "تم الحفظ"
                : heroMsg === "Error"
                ? "حدث خطأ"
                : heroMsg}
            </div>
          )}
        </form>
      </div>
      <form onSubmit={create} className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">الصورة</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              العنوان (إنجليزي)
            </label>
            <input
              className="input"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              العنوان (عربي)
            </label>
            <input
              className="input"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              الوصف (إنجليزي)
            </label>
            <textarea
              className="textarea"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              الوصف (عربي)
            </label>
            <textarea
              className="textarea"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={creating}>
          {creating ? "جارٍ الإنشاء..." : "إنشاء"}
        </button>
      </form>

      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">الموجودة</h2>
        {items.length === 0 && <div>لا توجد أنشطة</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item._id} className="card p-3">
              <SafeImage
                src={item.imgUrl}
                alt=""
                width={800}
                height={320}
                className="w-full h-40 object-cover rounded border mb-2"
              />
              <div className="font-medium">{item.title_en}</div>
              <div className="text-sm text-muted">{item.title_ar}</div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  className="btn btn-outline"
                  onClick={() => startEdit(item)}
                >
                  تعديل
                </button>
                <button
                  className="btn bg-red-600 text-white"
                  onClick={() => remove(item._id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editId && (
        <form onSubmit={saveEdit} className="card p-4 space-y-4">
          <h3 className="text-lg font-medium">تعديل</h3>
          <div>
            <label className="block text-sm font-medium mb-1">الصورة</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEdit((p) => ({ ...p, file: e.target.files?.[0] || null }))
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                رابط الصورة (اختياري)
              </label>
              <input
                className="input"
                value={edit.imgUrl}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, imgUrl: e.target.value }))
                }
                placeholder="http://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                العنوان (إنجليزي)
              </label>
              <input
                className="input"
                value={edit.title_en}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, title_en: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                العنوان (عربي)
              </label>
              <input
                className="input"
                value={edit.title_ar}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, title_ar: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                الوصف (إنجليزي)
              </label>
              <textarea
                className="textarea"
                value={edit.description_en}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, description_en: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                الوصف (عربي)
              </label>
              <textarea
                className="textarea"
                value={edit.description_ar}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, description_ar: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingEdit}
            >
              {savingEdit ? "جارٍ الحفظ..." : "حفظ"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setEditId(null)}
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
