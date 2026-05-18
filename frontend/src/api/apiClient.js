export const API_BASE = "http://127.0.0.1:5000";

export async function apiRequest(path, options = {}) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: "Network Error",
      data: {
        error:
          "Could not connect to Flask API. Make sure python api.py is running.",
        details: error.message,
      },
    };
  }
}
