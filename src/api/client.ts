import { Trade, TradeCreatePayload } from "@/types/trade";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const tradeApi = {
  getAll: () => request<Trade[]>("/trade"),
  
  getById: (id: string) => request<Trade>(`/trade/${id}`),
  
  create: (data: TradeCreatePayload) =>
    request<Trade>("/trade", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    request<void>("/trade", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }),
};

export const authApi = {
  login: (email: string, password: string) =>
    request<{ message: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<void>("/auth/logout", { method: "POST" }),
};
