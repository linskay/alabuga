export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return undefined as unknown as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' as HttpMethod }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST' as HttpMethod, body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT' as HttpMethod, body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' as HttpMethod }),
};

// Domain helpers
export type RankDTO = { id: number; name: string; level: number; branch: string; description?: string };
export type ShopItemDTO = { id: number; name: string; price: number; available: boolean; description?: string };
export type ArtifactDTO = { id: number; name: string; rarity?: string; active?: boolean; description?: string };
export type UserDTO = { id: number; login: string; email: string; role: string; experience: number; energy: number; rank: number; firstName?: string; lastName?: string };

export const backend = {
  ranks: {
    list: () => api.get<RankDTO[]>('/api/ranks'),
    requirements: () => api.get<any[]>('/api/ranks/requirements'),
  },
  shop: {
    available: () => api.get<ShopItemDTO[]>('/api/shop/available'),
    update: (id: number, body: Partial<ShopItemDTO>) => api.put<ShopItemDTO>(`/api/shop/${id}`, body),
    create: (body: Partial<ShopItemDTO>) => api.post<ShopItemDTO>('/api/shop', body),
  },
  artifacts: {
    active: () => api.get<ArtifactDTO[]>('/api/artifacts/active'),
  },
  users: {
    create: (body: any) => api.post<any>('/api/users', body),
    byId: (id: number) => api.get<UserDTO>(`/api/users/${id}`),
    byLogin: (login: string) => api.get<UserDTO>(`/api/users/login/${encodeURIComponent(login)}`),
  },
  missions: {
    create: (body: any) => api.post<any>('/api/missions', body),
  },
};


