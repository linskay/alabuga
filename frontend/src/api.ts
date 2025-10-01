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
    let errorMessage = text || res.statusText;
    
    // Пытаемся парсить JSON ответ от бекенда
    try {
      const errorData = JSON.parse(text);
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Если не JSON, используем исходный текст
    }
    
    const error = new Error(errorMessage);
    (error as any).response = { data: { message: errorMessage } };
    throw error;
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
export type ArtifactDTO = { id: number; name: string; rarity?: string; isActive?: boolean; description?: string };
export type UserRoleDTO = { value: string; displayName: string };
export type UserDTO = { id: number; login: string; email: string; role: string; experience: number; energy: number; rank: number; branchId?: number; firstName?: string; lastName?: string; createdAt?: string; isActive?: boolean; };
export type UserPurchaseDTO = { id: number; itemName: string; itemDescription: string; pricePaid: number; energyAfter: number; purchasedAt: string; };
export type UserCompetency = { id: number; name: string; points?: number; level?: number; maxPoints?: number };
export type UserMission = { id: number; missionId?: number; missionName?: string; status?: string; progress?: number };
export type MissionDTO = { id: number; name: string; description?: string; difficulty?: string; experienceReward?: number; isActive?: boolean; requiredExperience?: number; requiredRank?: number; type?: string };
export type CardDTO = { id: number; name: string; seriesName: string; frontImageUrl?: string; backDescription?: string; rarity: string; unlockCondition?: string; unlockRank?: number; isActive?: boolean };
export type UserCardDTO = { id: number; user: any; card: CardDTO; obtainedAt: string; isNew: boolean };

export const backend = {
  auth: {
    login: (login: string, password?: string) => api.post<{ success: boolean; user: UserDTO; message: string }>('/api/auth/login', { login, password }),
    validate: (login: string) => api.post<{ valid: boolean; user: UserDTO }>('/api/auth/validate', { login }),
  },
  shop: {
    list: () => api.get<ShopItemDTO[]>('/api/shop'),
    available: () => api.get<ShopItemDTO[]>('/api/shop/available'),
    update: (id: number, body: Partial<ShopItemDTO>) => api.put<ShopItemDTO>(`/api/shop/${id}`, body),
    create: (body: Partial<ShopItemDTO>) => api.post<ShopItemDTO>('/api/shop', body),
    delete: (id: number) => api.delete<void>(`/api/shop/${id}`),
    purchase: (userId: number, shopItemId: number) => api.post(`/api/shop/purchase?userId=${userId}&shopItemId=${shopItemId}`),
    purchaseHistory: (userId: number) => api.get<UserPurchaseDTO[]>(`/api/shop/purchases/${userId}`),
    confirmationMessage: (shopItemId: number) => api.get<{ message: string }>(`/api/shop/${shopItemId}/confirmation-message`),
  },
  artifacts: {
    list: () => api.get<ArtifactDTO[]>('/api/artifacts'),
    active: () => api.get<ArtifactDTO[]>('/api/artifacts/active'),
    create: (body: Partial<ArtifactDTO>) => api.post<ArtifactDTO>('/api/artifacts', body),
    update: (id: number, body: Partial<ArtifactDTO>) => api.put<ArtifactDTO>(`/api/artifacts/${id}`, body),
    delete: (id: number) => api.delete<void>(`/api/artifacts/${id}`),
  },
  messages: {
    // Подтверждения действий
    deleteUser: (userId: number) => api.get<{ title: string; message: string }>(`/api/messages/delete-user/${userId}`),
    deleteArtifact: (artifactId: number) => api.get<{ title: string; message: string }>(`/api/messages/delete-artifact/${artifactId}`),
    deleteMission: (missionId: number) => api.get<{ title: string; message: string }>(`/api/messages/delete-mission/${missionId}`),
    completeMission: (missionId: number) => api.get<{ title: string; message: string }>(`/api/messages/complete-mission/${missionId}`),
    removeMission: (userId: number, missionId: number) => api.get<{ title: string; message: string }>(`/api/messages/remove-mission/${userId}/${missionId}`),
    takeMission: (missionId: number) => api.get<{ title: string; message: string }>(`/api/messages/take-mission/${missionId}`),
    
    // Сообщения покупки
    purchase: (shopItemId: number) => api.get<{ title: string; message: string }>(`/api/messages/purchase/${shopItemId}`),
    
    // UI тексты
    uiTexts: () => api.get<{ [key: string]: string }>('/api/messages/ui-texts'),
  },
  competencies: {
    list: () => api.get<any[]>('/api/competencies'),
  },
  users: {
    create: (body: any) => api.post<any>('/api/users', body),
    list: () => api.get<UserDTO[]>('/api/users'),
    roles: () => api.get<UserRoleDTO[]>('/api/users/roles'),
    byId: (id: number) => api.get<UserDTO>(`/api/users/${id}`),
    byLogin: (login: string) => api.get<UserDTO>(`/api/users/login/${encodeURIComponent(login)}`),
    update: (id: number, body: Partial<UserDTO>) => api.put<UserDTO>(`/api/users/${id}`, body),
    delete: (id: number) => api.delete<void>(`/api/users/${id}`),
    competencies: (userId: number) => api.get<UserCompetency[]>(`/api/users/${userId}/competencies`),
    missions: (userId: number) => api.get<UserMission[]>(`/api/missions/user/${userId}`),
    takeMission: (userId: number, missionId: number) => api.post(`/api/users/${userId}/missions/${missionId}/take`),
    completeMission: (userId: number, missionId: number) => api.post(`/api/missions/complete?userId=${userId}&missionId=${missionId}`),
    removeMission: (userId: number, missionId: number) => api.delete(`/api/users/${userId}/missions/${missionId}/remove`),
    artifacts: (userId: number) => api.get<any[]>(`/api/users/${userId}/artifacts`),
    equipArtifact: (userId: number, artifactId: number) => api.post(`/api/users/${userId}/artifacts/${artifactId}/equip`),
    giveArtifact: (userId: number, artifactId: number) => api.post(`/api/users/${userId}/artifacts/${artifactId}/give`),
  },
  branches: {
    list: () => api.get<any[]>('/api/branches'),
  },
  missions: {
    create: (body: any) => api.post<any>('/api/missions', body),
    byUser: (userId: number) => api.get<UserMission[]>(`/api/users/${userId}/missions`),
    list: () => api.get<MissionDTO[]>('/api/missions'),
    update: (id: number, body: Partial<MissionDTO>) => api.put<MissionDTO>(`/api/missions/${id}`, body),
    delete: (id: number) => api.delete<void>(`/api/missions/${id}`),
    moderate: (userId: number, missionId: number, approved: boolean) => api.post(`/api/missions/moderate?userId=${userId}&missionId=${missionId}&approved=${approved}`),
  },
  ranks: {
    list: () => api.get<RankDTO[]>('/api/ranks'),
    byLevel: (level: number) => api.get<any>(`/api/ranks/level/${level}`),
    requirements: () => api.get<any[]>('/api/ranks/requirements'),
    requirementsByLevel: (level: number) => api.get<any>(`/api/ranks/requirements/level/${level}`),
  },
  cards: {
    available: (userId: number) => api.get<CardDTO[]>(`/api/cards/available/${userId}`),
    userCards: (userId: number) => api.get<UserCardDTO[]>(`/api/cards/user/${userId}`),
    userCardsBySeries: (userId: number, seriesName: string) => api.get<UserCardDTO[]>(`/api/cards/user/${userId}/series/${encodeURIComponent(seriesName)}`),
    checkAwards: (userId: number) => api.post(`/api/cards/check-awards/${userId}`),
    markViewed: (userId: number, cardId: number) => api.post(`/api/cards/mark-viewed/${userId}/${cardId}`),
    series: () => api.get<string[]>('/api/cards/series'),
    cardsBySeries: (seriesName: string) => api.get<CardDTO[]>(`/api/cards/series/${encodeURIComponent(seriesName)}`),
  },
};


