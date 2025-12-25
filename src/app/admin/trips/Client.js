"use client";

import { useState, useEffect, useMemo } from "react";
import { apiJson } from "@/lib/api";
import SafeImage from "@/components/SafeImage";

export default function TripsClient() {
  const [items, setItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [file, setFile] = useState(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [price, setPrice] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [timeEn, setTimeEn] = useState("");
  const [timeAr, setTimeAr] = useState("");
  const [locEn, setLocEn] = useState("");
  const [locAr, setLocAr] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [currency, setCurrency] = useState("SAR");
  const [sooner, setSooner] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [fridayLinksMap, setFridayLinksMap] = useState({});
  const [editFridayLinksMap, setEditFridayLinksMap] = useState({});

  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({
    file: null,
    imgUrl: "",
    title_en: "",
    title_ar: "",
    price: "",
    currency: "SAR",
    description_en: "",
    description_ar: "",
    time_range_en: "",
    time_range_ar: "",
    location_en: "",
    location_ar: "",
    map_url: "",
    sooner: false,
    startDate: "",
    endDate: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await apiJson("/api/trips");
      if (mounted && res.ok) setItems(res.data || []);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const fridayDates = useMemo(() => {
    if (!startDate || !endDate) return [];
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return [];
    const d = new Date(s);
    d.setHours(0, 0, 0, 0);
    const offset = (5 - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + offset);
    const list = [];
    while (d <= e) {
      list.push(new Date(d).toISOString());
      d.setDate(d.getDate() + 7);
    }
    return list;
  }, [startDate, endDate]);

  const editFridayDates = useMemo(() => {
    if (!edit.startDate || !edit.endDate) return [];
    const s = new Date(edit.startDate);
    const e = new Date(edit.endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return [];
    const d = new Date(s);
    d.setHours(0, 0, 0, 0);
    const offset = (5 - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + offset);
    const list = [];
    while (d <= e) {
      list.push(new Date(d).toISOString());
      d.setDate(d.getDate() + 7);
    }
    return list;
  }, [edit.startDate, edit.endDate]);

  async function create(e) {
    e.preventDefault();
    setCreating(true);
    const form = new FormData();
    if (file) form.append("image", file);
    if (!file && imgUrl) form.append("imgUrl", imgUrl);
    form.append("title_en", titleEn);
    form.append("title_ar", titleAr);
    form.append("price", price);
    if (descEn) form.append("description_en", descEn);
    if (descAr) form.append("description_ar", descAr);
    if (timeEn) form.append("time_range_en", timeEn);
    if (timeAr) form.append("time_range_ar", timeAr);
    if (locEn) form.append("location_en", locEn);
    if (locAr) form.append("location_ar", locAr);
    if (mapUrl) form.append("map_url", mapUrl);
    if (currency) form.append("currency", currency);
    form.append("sooner", String(sooner));
    if (startDate) form.append("startDate", new Date(startDate).toISOString());
    if (endDate) form.append("endDate", new Date(endDate).toISOString());
    if (fridayDates.length > 0) {
      const links = fridayDates.map((date) => ({
        date,
        link: fridayLinksMap[date] || "",
      }));
      form.append("fridayLinks", JSON.stringify(links));
    }
    const res = await apiJson("/api/trips", { method: "POST", body: form });
    setCreating(false);
    if (res.ok) {
      setItems((prev) => [res.data, ...prev]);
      setFile(null);
      setImgUrl("");
      setTitleEn("");
      setTitleAr("");
      setPrice("");
      setDescEn("");
      setDescAr("");
      setTimeEn("");
      setTimeAr("");
      setLocEn("");
      setLocAr("");
      setMapUrl("");
      setCurrency("SAR");
      setSooner(false);
      setStartDate("");
      setEndDate("");
      setFridayLinksMap({});
    }
  }

  async function remove(id) {
    const res = await apiJson(`/api/trips/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((x) => x._id !== id));
  }

  function toLocalInput(v) {
    if (!v) return "";
    const d = new Date(v);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function startEdit(item) {
    setEditId(item._id);
    setEdit({
      file: null,
      imgUrl: "",
      title_en: item.title_en || "",
      title_ar: item.title_ar || "",
      price: item.price != null ? String(item.price) : "",
      currency: item.currency || "SAR",
      description_en: item.description_en || "",
      description_ar: item.description_ar || "",
      time_range_en: item.time_range_en || "",
      time_range_ar: item.time_range_ar || "",
      location_en: item.location_en || "",
      location_ar: item.location_ar || "",
      map_url: item.map_url || "",
      sooner: !!item.sooner,
      startDate: toLocalInput(item.startDate),
      endDate: toLocalInput(item.endDate),
    });
    setEditFridayLinksMap(() => {
      const map = {};
      const fr = Array.isArray(item.fridays) ? item.fridays : [];
      for (const f of fr) {
        if (f && typeof f.date === "string") {
          map[f.date] = f.link || "";
        }
      }
      return map;
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
    if (edit.price) form.append("price", edit.price);
    if (edit.currency) form.append("currency", edit.currency);
    if (edit.description_en) form.append("description_en", edit.description_en);
    if (edit.description_ar) form.append("description_ar", edit.description_ar);
    if (edit.time_range_en) form.append("time_range_en", edit.time_range_en);
    if (edit.time_range_ar) form.append("time_range_ar", edit.time_range_ar);
    if (edit.location_en) form.append("location_en", edit.location_en);
    if (edit.location_ar) form.append("location_ar", edit.location_ar);
    if (edit.map_url) form.append("map_url", edit.map_url);
    form.append("sooner", String(!!edit.sooner));
    if (edit.startDate)
      form.append("startDate", new Date(edit.startDate).toISOString());
    if (edit.endDate)
      form.append("endDate", new Date(edit.endDate).toISOString());
    if (editFridayDates.length > 0) {
      const links = editFridayDates.map((date) => ({
        date,
        link: editFridayLinksMap[date] || "",
      }));
      form.append("fridayLinks", JSON.stringify(links));
    }
    const res = await apiJson(`/api/trips/${editId}`, {
      method: "PUT",
      body: form,
    });
    setSavingEdit(false);
    if (res.ok) {
      setItems((prev) => prev.map((x) => (x._id === editId ? res.data : x)));
      setEditId(null);
      setEditFridayLinksMap({});
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">الرحلات</h1>
      <form onSubmit={create} className="card p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">الصورة</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            رابط الصورة (اختياري)
          </label>
          <input
            className="input"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder="http://..."
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
            <label className="block text-sm font-medium mb-1">السعر</label>
            <input
              type="number"
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">العملة</label>
            <input
              className="input"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              الفترة الزمنية (إنجليزي)
            </label>
            <input
              className="input"
              value={timeEn}
              onChange={(e) => setTimeEn(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              الفترة الزمنية (عربي)
            </label>
            <input
              className="input"
              value={timeAr}
              onChange={(e) => setTimeAr(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              الموقع (إنجليزي)
            </label>
            <input
              className="input"
              value={locEn}
              onChange={(e) => setLocEn(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              الموقع (عربي)
            </label>
            <input
              className="input"
              value={locAr}
              onChange={(e) => setLocAr(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              رابط الخريطة
            </label>
            <input
              className="input"
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="sooner"
              type="checkbox"
              checked={sooner}
              onChange={(e) => setSooner(e.target.checked)}
            />
            <label htmlFor="sooner">قريبًا</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              تاريخ البدء
            </label>
            <input
              type="datetime-local"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              تاريخ الانتهاء
            </label>
            <input
              type="datetime-local"
              className="input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {fridayDates.length > 0 && (
            <div>
              <div className="block text-sm font-medium mb-1">
                روابط أيام الجمعة
              </div>
              <div className="space-y-2">
                {fridayDates.map((date) => (
                  <div key={date} className="flex items-center gap-2">
                    <div className="text-xs">
                      {new Date(date).toLocaleDateString()}
                    </div>
                    <input
                      className="input flex-1"
                      value={fridayLinksMap[date] || ""}
                      onChange={(e) =>
                        setFridayLinksMap((p) => ({
                          ...p,
                          [date]: e.target.value,
                        }))
                      }
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary" disabled={creating}>
          {creating ? "جارٍ الإنشاء..." : "إنشاء"}
        </button>
      </form>

      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">الموجودة</h2>
        {items.length === 0 && <div>لا توجد رحلات</div>}
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
              <div className="text-sm">
                السعر: {item.price} {item.currency}
              </div>
              <div className="text-sm">
                من: {item.startDate || "-"} إلى: {item.endDate || "-"}
              </div>
              <div className="text-sm">القادم: {item.nextDate}</div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  className="btn btn-outline"
                  onClick={() => startEdit(item)}
                >
                  تعديل البيانات
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
          <h3 className="text-lg font-medium">تعديل الرحلة</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-1">السعر</label>
              <input
                type="number"
                className="input"
                value={edit.price}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, price: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">العملة</label>
              <input
                className="input"
                value={edit.currency}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, currency: e.target.value }))
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
            <div>
              <label className="block text-sm font-medium mb-1">
                الفترة الزمنية (إنجليزي)
              </label>
              <input
                className="input"
                value={edit.time_range_en}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, time_range_en: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                الفترة الزمنية (عربي)
              </label>
              <input
                className="input"
                value={edit.time_range_ar}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, time_range_ar: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                الموقع (إنجليزي)
              </label>
              <input
                className="input"
                value={edit.location_en}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, location_en: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                الموقع (عربي)
              </label>
              <input
                className="input"
                value={edit.location_ar}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, location_ar: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                رابط الخريطة
              </label>
              <input
                className="input"
                value={edit.map_url}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, map_url: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="edit-sooner"
                type="checkbox"
                checked={edit.sooner}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, sooner: e.target.checked }))
                }
              />
              <label htmlFor="edit-sooner">قريبًا</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                تاريخ البدء
              </label>
              <input
                type="datetime-local"
                className="input"
                value={edit.startDate}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                تاريخ الانتهاء
              </label>
              <input
                type="datetime-local"
                className="input"
                value={edit.endDate}
                onChange={(e) =>
                  setEdit((p) => ({ ...p, endDate: e.target.value }))
                }
              />
            </div>
            {editFridayDates.length > 0 && (
              <div className="md:col-span-2">
                <div className="block text-sm font-medium mb-1">
                  روابط أيام الجمعة
                </div>
                <div className="space-y-2">
                  {editFridayDates.map((date) => (
                    <div key={date} className="flex items-center gap-2">
                      <div className="text-xs">
                        {new Date(date).toLocaleDateString()}
                      </div>
                      <input
                        className="input flex-1"
                        value={editFridayLinksMap[date] || ""}
                        onChange={(e) =>
                          setEditFridayLinksMap((p) => ({
                            ...p,
                            [date]: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              onClick={() => {
                setEditId(null);
                setEditFridayLinksMap({});
              }}
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
