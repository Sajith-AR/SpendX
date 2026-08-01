import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Transaction, AccountOwner, FinancialSummary, Budget, Goal, Bill, NotificationItem } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  owners: AccountOwner[];
  summary: FinancialSummary | null;
  budgets: Budget[];
  goals: Goal[];
  bills: Bill[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  loading: boolean;
  selectedOwner: string; // 'All', 'Me', 'Father', 'Mother', 'Family', etc.
  currency: string; // 'INR', 'USD', 'EUR', 'GBP'
  currencySymbol: string;
  toasts: Toast[];

  setSelectedOwner: (owner: string) => void;
  setCurrency: (curr: string) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  refreshAll: () => Promise<void>;
  addTransaction: (data: Partial<Transaction>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  addOwner: (name: string, relationship?: string, color?: string) => Promise<void>;
  deleteOwner: (id: string) => Promise<void>;

  saveBudget: (category: string, amount: number) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  createGoal: (data: Partial<Goal>) => Promise<void>;
  addMoneyToGoal: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  createBill: (data: Partial<Bill>) => Promise<void>;
  updateBillStatus: (id: string, status: Bill['status']) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;

  markNotificationsRead: (id?: string) => Promise<void>;
  formatCurrency: (amount: number) => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [owners, setOwners] = useState<AccountOwner[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedOwner, setSelectedOwner] = useState<string>('All');
  const [currency, setCurrency] = useState<string>('INR');
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (user?.defaultCurrency) {
      setCurrency(user.defaultCurrency);
    }
  }, [user]);

  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const currencySymbol = currencySymbols[currency] || '₹';

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ownerParam = selectedOwner !== 'All' ? `?owner=${encodeURIComponent(selectedOwner)}` : '';

      const [txRes, sumRes, ownerRes, budgetRes, goalRes, billRes, notifRes] = await Promise.all([
        api.get(`/transactions${ownerParam}`),
        api.get(`/transactions/summary${ownerParam}`),
        api.get('/owners'),
        api.get('/budgets'),
        api.get('/goals'),
        api.get('/bills'),
        api.get('/notifications'),
      ]);

      if (txRes.success) setTransactions(txRes.transactions || []);
      if (sumRes.success) setSummary(sumRes.summary || null);
      if (ownerRes.success) setOwners(ownerRes.owners || []);
      if (budgetRes.success) setBudgets(budgetRes.budgets || []);
      if (goalRes.success) setGoals(goalRes.goals || []);
      if (billRes.success) setBills(billRes.bills || []);
      if (notifRes.success) {
        setNotifications(notifRes.notifications || []);
        setUnreadNotificationsCount(notifRes.unreadCount || 0);
      }
    } catch (err: any) {
      console.error('Failed to load financial data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedOwner]);

  useEffect(() => {
    if (user) {
      refreshAll();
    }
  }, [user, selectedOwner, refreshAll]);

  // Actions
  const addTransaction = async (data: Partial<Transaction>) => {
    try {
      const res = await api.post('/transactions', data);
      if (res.success) {
        showToast('Transaction added successfully!', 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add transaction', 'error');
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      const res = await api.put(`/transactions/${id}`, data);
      if (res.success) {
        showToast('Transaction updated.', 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update transaction', 'error');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const res = await api.delete(`/transactions/${id}`);
      if (res.success) {
        showToast('Transaction deleted.', 'info');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete transaction', 'error');
    }
  };

  const addOwner = async (name: string, relationship?: string, color?: string) => {
    try {
      const res = await api.post('/owners', { name, relationship, color });
      if (res.success) {
        showToast(`Account owner "${name}" added.`, 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add owner', 'error');
    }
  };

  const deleteOwner = async (id: string) => {
    try {
      const res = await api.delete(`/owners/${id}`);
      if (res.success) {
        showToast('Account owner removed.', 'info');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete owner', 'error');
    }
  };

  const saveBudget = async (category: string, amount: number) => {
    try {
      const res = await api.post('/budgets', { category, amount });
      if (res.success) {
        showToast(`Budget set for ${category}.`, 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to set budget', 'error');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const res = await api.delete(`/budgets/${id}`);
      if (res.success) {
        showToast('Budget removed.', 'info');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete budget', 'error');
    }
  };

  const createGoal = async (data: Partial<Goal>) => {
    try {
      const res = await api.post('/goals', data);
      if (res.success) {
        showToast(`Savings goal "${data.name}" created!`, 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create goal', 'error');
    }
  };

  const addMoneyToGoal = async (id: string, amount: number) => {
    try {
      const res = await api.post(`/goals/${id}/add-money`, { amount });
      if (res.success) {
        showToast(`Added ${currencySymbol}${amount.toLocaleString()} to goal!`, 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add money', 'error');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const res = await api.delete(`/goals/${id}`);
      if (res.success) {
        showToast('Savings goal deleted.', 'info');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete goal', 'error');
    }
  };

  const createBill = async (data: Partial<Bill>) => {
    try {
      const res = await api.post('/bills', data);
      if (res.success) {
        showToast(`Bill "${data.name}" added.`, 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add bill', 'error');
    }
  };

  const updateBillStatus = async (id: string, status: Bill['status']) => {
    try {
      const res = await api.put(`/bills/${id}/status`, { status });
      if (res.success) {
        showToast(`Bill marked as ${status}.`, 'success');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update bill', 'error');
    }
  };

  const deleteBill = async (id: string) => {
    try {
      const res = await api.delete(`/bills/${id}`);
      if (res.success) {
        showToast('Bill removed.', 'info');
        await refreshAll();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete bill', 'error');
    }
  };

  const markNotificationsRead = async (id?: string) => {
    try {
      await api.put(`/notifications/${id || 'all'}/read`);
      await refreshAll();
    } catch (err: any) {
      console.error(err);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `${currencySymbol}${Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        owners,
        summary,
        budgets,
        goals,
        bills,
        notifications,
        unreadNotificationsCount,
        loading,
        selectedOwner,
        currency,
        currencySymbol,
        toasts,
        setSelectedOwner,
        setCurrency,
        showToast,
        removeToast,
        refreshAll,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addOwner,
        deleteOwner,
        saveBudget,
        deleteBudget,
        createGoal,
        addMoneyToGoal,
        deleteGoal,
        createBill,
        updateBillStatus,
        deleteBill,
        markNotificationsRead,
        formatCurrency,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
