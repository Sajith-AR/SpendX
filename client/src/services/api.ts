import { Transaction, AccountOwner, FinancialSummary, Budget, Goal, Bill, NotificationItem } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('spendx_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  get: async (url: string) => {
    const res = await fetch(`${API_BASE}${url}`, { method: 'GET', headers: getHeaders() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },

  post: async (url: string, data?: any) => {
    const res = await fetch(`${API_BASE}${url}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },

  put: async (url: string, data?: any) => {
    const res = await fetch(`${API_BASE}${url}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },

  delete: async (url: string) => {
    const res = await fetch(`${API_BASE}${url}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  },
};

// Direct export helpers matching context calls
export const getTransactions = async (ownerFilter?: string): Promise<Transaction[]> => {
  const ownerParam = ownerFilter && ownerFilter !== 'All' ? `?owner=${encodeURIComponent(ownerFilter)}` : '';
  const res = await api.get(`/transactions${ownerParam}`);
  return res.transactions || [];
};

export const createTransaction = async (data: Partial<Transaction>): Promise<Transaction> => {
  const res = await api.post('/transactions', data);
  return res.transaction;
};

export const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
  const res = await api.put(`/transactions/${id}`, data);
  return res.transaction;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const getFinancialSummary = async (ownerFilter?: string): Promise<FinancialSummary> => {
  const ownerParam = ownerFilter && ownerFilter !== 'All' ? `?owner=${encodeURIComponent(ownerFilter)}` : '';
  const res = await api.get(`/transactions/summary${ownerParam}`);
  return res.summary;
};

export const getOwners = async (): Promise<AccountOwner[]> => {
  const res = await api.get('/owners');
  return res.owners || [];
};

export const createOwner = async (name: string, relationship?: string, color?: string): Promise<AccountOwner> => {
  const res = await api.post('/owners', { name, relationship, color });
  return res.owner;
};

export const updateInitialBalances = async (balances: Record<string, number>): Promise<AccountOwner[]> => {
  const res = await api.put('/owners/balances', { balances });
  return res.owners || [];
};

export const deleteOwner = async (id: string): Promise<void> => {
  await api.delete(`/owners/${id}`);
};

export const getBudgets = async (): Promise<Budget[]> => {
  const res = await api.get('/budgets');
  return res.budgets || [];
};

export const upsertBudget = async (category: string, amount: number): Promise<void> => {
  await api.post('/budgets', { category, amount });
};

export const deleteBudget = async (id: string): Promise<void> => {
  await api.delete(`/budgets/${id}`);
};

export const getGoals = async (): Promise<Goal[]> => {
  const res = await api.get('/goals');
  return res.goals || [];
};

export const createGoal = async (data: Partial<Goal>): Promise<Goal> => {
  const res = await api.post('/goals', data);
  return res.goal;
};

export const addMoneyToGoal = async (id: string, amount: number): Promise<Goal> => {
  const res = await api.post(`/goals/${id}/add-money`, { amount });
  return res.goal;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

export const getBills = async (): Promise<Bill[]> => {
  const res = await api.get('/bills');
  return res.bills || [];
};

export const createBill = async (data: Partial<Bill>): Promise<Bill> => {
  const res = await api.post('/bills', data);
  return res.bill;
};

export const updateBillStatus = async (id: string, status: Bill['status']): Promise<void> => {
  await api.put(`/bills/${id}/status`, { status });
};

export const deleteBill = async (id: string): Promise<void> => {
  await api.delete(`/bills/${id}`);
};

export const getNotifications = async (): Promise<{ notifications: NotificationItem[]; unreadCount: number }> => {
  const res = await api.get('/notifications');
  return { notifications: res.notifications || [], unreadCount: res.unreadCount || 0 };
};

export const markNotificationsRead = async (id?: string): Promise<void> => {
  await api.put(`/notifications/${id || 'all'}/read`);
};
