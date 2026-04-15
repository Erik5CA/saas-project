import { parseCookies } from "nookies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type ApiOptions = RequestInit & {
  tenantId?: string;
  token?: string;
};

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { tenantId, token: customToken, ...customOptions } = options;

  // Get token from cookies if not provided
  const cookies = parseCookies();
  const token = customToken || cookies["auth_token"];

  console.log({ token });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (tenantId) {
    headers["x-tenant-id"] = tenantId;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...customOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ocurrió un error en la petición");
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: any, options?: ApiOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body: any, options?: ApiOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: ApiOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
