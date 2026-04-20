const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  await delay(500);
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || contentLength === '0' || !contentType?.includes('application/json')) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
