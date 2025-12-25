import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (!config.headers) config.headers = {};
  config.headers["Accept"] = "application/json";
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;
  if (config.data && !isFormData) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export async function apiJson(path, options = {}) {
  const method = (options.method || "GET").toLowerCase();
  const headers = options.headers || {};
  const data = options.body;
  try {
    const res = await api.request({
      url: path,
      method,
      headers,
      data,
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err.response) {
      return {
        ok: false,
        status: err.response.status,
        data: err.response.data,
      };
    }
    return { ok: false, status: 0, data: null };
  }
}
