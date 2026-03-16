const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

export type ApiError = {
  status: number;
  message: string;
};

async function parseError(res: Response): Promise<ApiError> {
  let message = res.statusText || "Request failed";
  try {
    const text = await res.text();
    if (text) message = text;
  } catch {
    // ignore
  }
  return { status: res.status, message };
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    throw await parseError(res);
  }

  // 204
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  // fallback
  return (await res.text()) as unknown as T;
}

