import { Trade, TradeCreatePayload } from "@/types/trade";

const API_BASE = import.meta.env.VITE_API_URL || "https://investmentloggerbackend.netlify.app/.netlify/functions/server";

// Simple token storage
let authToken: string | null = localStorage.getItem("auth_token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken() {
  return authToken;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const tradeApi = {
  getAll: () => request<{ data: Trade[] }>("/trade").then((res) => res.data),
  
  getById: (id: string) => request<{ data: Trade }>(`/trade/${id}`).then((res) => res.data),
  
  create: (data: TradeCreatePayload) =>
    request<Trade>("/trade", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    request<void>(`/trade/${id}`, {
      method: "DELETE",
    }),
};

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await request<{ message: string; token?: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  logout: async () => {
    const res = await request<void>("/auth/logout", { method: "POST" });
    setAuthToken(null);
    return res;
  },
};
