export interface User {
  id: string;
  name: string;
  email: string;
  defaultCurrency: string;
  dateFormat: string;
  theme: string;
  defaultOwner: string;
  notificationsEnabled?: boolean;
}

export interface AccountOwner {
  _id: string;
  name: string;
  relationship: string;
  color: string;
  isSystem: boolean;
}

export interface Transaction {
  _id: string;
  owner: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  createdAt?: string;
}

export interface FinancialSummary {
  totalBalance: number;
  myBalance: number;
  familyBalance: number;
  totalIncome: number;
  totalExpense: number;
  myIncome: number;
  myExpense: number;
  familyIncome: number;
  familyExpense: number;
  savings: number;
  savingsRate: number;
  ownerBreakdown: Record<string, { income: number; expense: number; balance: number }>;
}

export interface Budget {
  _id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  alertStatus: 'normal' | 'warning' | 'critical' | 'exceeded';
  month: number;
  year: number;
}

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progress: number;
  deadline?: string;
  category?: string;
  icon?: string;
}

export interface Bill {
  _id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  recurring: 'none' | 'monthly' | 'quarterly' | 'yearly';
  owner: string;
  status: 'upcoming' | 'paid' | 'overdue';
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'budget_warning' | 'bill_due' | 'goal_reached' | 'large_expense' | 'info';
  read: boolean;
  createdAt: string;
}
