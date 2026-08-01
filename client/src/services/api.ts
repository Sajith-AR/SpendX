const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('finora_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  get: async (url: string) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },

  post: async (url: string, data?: any) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },

  put: async (url: string, data?: any) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },

  delete: async (url: string) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },
};
