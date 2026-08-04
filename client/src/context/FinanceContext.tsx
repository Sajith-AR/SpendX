import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Transaction, AccountOwner, FinancialSummary,
  Budget, Goal, Bill, NotificationItem,
} from '../types';
import * as api from '../services/api';
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
  selectedOwner: string;
  currency: string;
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
  updateInitialBalances: (balances: Record<string, number>) => Promise<void>;
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

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£',
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [transactions, setTransactions]         = useState<Transaction[]>([]);
  const [owners, setOwners]                     = useState<AccountOwner[]>([]);
  const [summary, setSummary]                   = useState<FinancialSummary | null>(null);
  const [budgets, setBudgets]                   = useState<Budget[]>([]);
  const [goals, setGoals]                       = useState<Goal[]>([]);
  const [bills, setBills]                       = useState<Bill[]>([]);
  const [notifications, setNotifications]       = useState<NotificationItem[]>([]);
  const [unreadNotificationsCount, setUnread]   = useState(0);
  const [loading, setLoading]                   = useState(true);
  const [selectedOwner, setSelectedOwner]       = useState('All');
  const [currency, setCurrency]                 = useState('INR');
  const [toasts, setToasts]                     = useState<Toast[]>([]);

  useEffect(() => {
    if (user?.defaultCurrency) setCurrency(user.defaultCurrency);
  }, [user]);

  const currencySymbol = CURRENCY_SYMBOLS[currency] || '₹';

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const refreshAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const ownerFilter = selectedOwner !== 'All' ? selectedOwner : undefined;

      const [txs, sum, ownerList, budgetList, goalList, billList, notifResult] = await Promise.all([
        api.getTransactions(ownerFilter),
        api.getFinancialSummary(ownerFilter),
        api.getOwners(),
        api.getBudgets(),
        api.getGoals(),
        api.getBills(),
        api.getNotifications(),
      ]);

      setTransactions(txs);
      setSummary(sum);
      setOwners(ownerList);
      setBudgets(budgetList);
      setGoals(goalList);
      setBills(billList);
      setNotifications(notifResult.notifications);
      setUnread(notifResult.unreadCount);
    } catch (err: unknown) {
      console.error('Failed to load financial data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, selectedOwner]);

  useEffect(() => {
    if (user) refreshAll();
  }, [user, selectedOwner, refreshAll]);

  // ── Transactions ──────────────────────────────────────────────────────────
  const addTransaction = async (data: Partial<Transaction>) => {
    try {
      await api.createTransaction(data);
      showToast('Transaction added successfully!', 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to add transaction', 'error');
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      await api.updateTransaction(id, data);
      showToast('Transaction updated.', 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update transaction', 'error');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.deleteTransaction(id);
      showToast('Transaction deleted.', 'info');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete transaction', 'error');
    }
  };

  // ── Owners ────────────────────────────────────────────────────────────────
  const addOwner = async (name: string, relationship?: string, color?: string) => {
    try {
      await api.createOwner(name, relationship, color);
      showToast(`Account owner "${name}" added.`, 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to add owner', 'error');
    }
  };

  const updateInitialBalances = async (balances: Record<string, number>) => {
    try {
      await api.updateInitialBalances(balances);
      showToast('Account balances updated!', 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update balances', 'error');
    }
  };

  const deleteOwner = async (id: string) => {
    try {
      await api.deleteOwner(id);
      showToast('Account owner removed.', 'info');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete owner', 'error');
    }
  };

  // ── Budgets ───────────────────────────────────────────────────────────────
  const saveBudget = async (category: string, amount: number) => {
    try {
      await api.upsertBudget(category, amount);
      showToast(`Budget set for ${category}.`, 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to set budget', 'error');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await api.deleteBudget(id);
      showToast('Budget removed.', 'info');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete budget', 'error');
    }
  };

  // ── Goals ─────────────────────────────────────────────────────────────────
  const createGoal = async (data: Partial<Goal>) => {
    try {
      await api.createGoal(data);
      showToast(`Savings goal "${data.name}" created!`, 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to create goal', 'error');
    }
  };

  const addMoneyToGoal = async (id: string, amount: number) => {
    try {
      await api.addMoneyToGoal(id, amount);
      showToast(`Added ${currencySymbol}${amount.toLocaleString()} to goal!`, 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to add money', 'error');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await api.deleteGoal(id);
      showToast('Savings goal deleted.', 'info');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete goal', 'error');
    }
  };

  // ── Bills ─────────────────────────────────────────────────────────────────
  const createBill = async (data: Partial<Bill>) => {
    try {
      await api.createBill(data);
      showToast(`Bill "${data.name}" added.`, 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to add bill', 'error');
    }
  };

  const updateBillStatus = async (id: string, status: Bill['status']) => {
    try {
      await api.updateBillStatus(id, status);
      showToast(`Bill marked as ${status}.`, 'success');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update bill', 'error');
    }
  };

  const deleteBill = async (id: string) => {
    try {
      await api.deleteBill(id);
      showToast('Bill removed.', 'info');
      await refreshAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete bill', 'error');
    }
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const markNotificationsRead = async (id?: string) => {
    try {
      await api.markNotificationsRead(id);
      await refreshAll();
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const formatCurrency = (amount: number): string =>
    `${currencySymbol}${Math.abs(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  return (
    <FinanceContext.Provider
      value={{
        transactions, owners, summary, budgets, goals, bills,
        notifications, unreadNotificationsCount, loading,
        selectedOwner, currency, currencySymbol, toasts,
        setSelectedOwner, setCurrency, showToast, removeToast,
        refreshAll,
        addTransaction, updateTransaction, deleteTransaction,
        addOwner, updateInitialBalances, deleteOwner,
        saveBudget, deleteBudget,
        createGoal, addMoneyToGoal, deleteGoal,
        createBill, updateBillStatus, deleteBill,
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
