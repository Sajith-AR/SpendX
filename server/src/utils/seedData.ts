import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';
import Goal from '../models/Goal';
import Bill from '../models/Bill';
import Notification from '../models/Notification';
import AccountOwner from '../models/AccountOwner';

export const seedUserDemoData = async (userId: string) => {
  let userObjId: mongoose.Types.ObjectId;
  try {
    userObjId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a3b');
  } catch {
    userObjId = new mongoose.Types.ObjectId('65f1a2b3c4d5e6f708192a3b');
  }

  // Clear existing data for reset
  await Transaction.deleteMany({ user: userObjId });
  await Budget.deleteMany({ user: userObjId });
  await Goal.deleteMany({ user: userObjId });
  await Bill.deleteMany({ user: userObjId });
  await Notification.deleteMany({ user: userObjId });
  await AccountOwner.deleteMany({ user: userObjId });

  // Create core Father & Son shared account owners with initial balances
  const defaultOwners = [
    { user: userObjId, name: 'Son (Sajith)', relationship: 'Me', color: '#14F195', initialBalance: 45000, isSystem: true },
    { user: userObjId, name: 'Dad', relationship: 'Father', color: '#3B82F6', initialBalance: 150000, isSystem: true },
    { user: userObjId, name: 'Family', relationship: 'Family', color: '#F59E0B', initialBalance: 20000, isSystem: true },
  ];
  await AccountOwner.insertMany(defaultOwners);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  const subDays = (d: number) => {
    const date = new Date();
    date.setDate(date.getDate() - d);
    return date;
  };

  const createDate = (year: number, month: number, day: number) => {
    return new Date(year, month - 1, day, 12, 0, 0);
  };

  const demoTransactions = [
    // Son (Sajith) & Dad recent transactions
    { user: userObjId, owner: 'Son (Sajith)', type: 'expense', amount: 120, category: 'Food', description: 'Coffee & Snacks', date: subDays(0), paymentMethod: 'UPI', notes: 'Starbucks' },
    { user: userObjId, owner: 'Son (Sajith)', type: 'expense', amount: 60, category: 'Transport', description: 'Metro Ride', date: subDays(0), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Dad', type: 'expense', amount: 2400, category: 'Bills', description: 'Electricity Bill', date: subDays(1), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Son (Sajith)', type: 'income', amount: 85000, category: 'Salary', description: 'Monthly Salary Credit', date: subDays(2), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Dad', type: 'income', amount: 120000, category: 'Business / Salary', description: 'Business Monthly Income', date: subDays(3), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Son (Sajith)', type: 'expense', amount: 1499, category: 'Recharge', description: 'Broadband Fiber Bill', date: subDays(4), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Family', type: 'expense', amount: 4200, category: 'Entertainment', description: 'Dad & Son Weekend Dinner', date: subDays(5), paymentMethod: 'Credit Card' },

    // Explicit date: 07/05/2026
    { user: userObjId, owner: 'Son (Sajith)', type: 'expense', amount: 120, category: 'Food', description: 'Coffee', date: createDate(2026, 7, 5), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Son (Sajith)', type: 'expense', amount: 60, category: 'Transport', description: 'Metro', date: createDate(2026, 7, 5), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Dad', type: 'expense', amount: 1500, category: 'Health', description: 'Pharmacy Prescription', date: createDate(2026, 7, 6), paymentMethod: 'Cash' },

    // Historical Dad & Son transactions
    { user: userObjId, owner: 'Son (Sajith)', type: 'income', amount: 85000, category: 'Salary', description: 'June Salary Credit', date: createDate(2026, 6, 1), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Dad', type: 'expense', amount: 12000, category: 'Bills', description: 'House Maintenance', date: createDate(2026, 6, 15), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Son (Sajith)', type: 'expense', amount: 3250, category: 'Food', description: 'Supermarket Groceries', date: createDate(2026, 7, 4), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Dad', type: 'income', amount: 45000, category: 'Investment', description: 'Dividend & Return', date: createDate(2026, 7, 2), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Dad', type: 'expense', amount: 5500, category: 'Bills', description: 'Home Solar EMI', date: createDate(2026, 7, 10), paymentMethod: 'UPI' },
  ];

  await Transaction.insertMany(demoTransactions);

  // Budgets
  const demoBudgets = [
    { user: userObjId, category: 'Food', amount: 10000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Bills', amount: 25000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Shopping', amount: 15000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Transport', amount: 6000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Entertainment', amount: 8000, month: currentMonth, year: currentYear },
  ];

  await Budget.insertMany(demoBudgets);

  // Goals
  const demoGoals = [
    { user: userObjId, name: 'Family Car Upgrade', targetAmount: 500000, currentAmount: 280000, category: 'Automobile', icon: 'Car', deadline: new Date(currentYear + 1, 5, 30) },
    { user: userObjId, name: 'Dad & Son Emergency Fund', targetAmount: 200000, currentAmount: 165000, category: 'Savings', icon: 'Shield', deadline: new Date(currentYear, 11, 31) },
  ];

  await Goal.insertMany(demoGoals);

  // Bills
  const demoBills = [
    { user: userObjId, name: 'Fiber Broadband', amount: 1499, dueDate: new Date(currentYear, currentMonth - 1, 28), category: 'Bills', recurring: 'monthly', owner: 'Son (Sajith)', status: 'upcoming' },
    { user: userObjId, name: 'Electricity & Utility', amount: 2400, dueDate: new Date(currentYear, currentMonth - 1, 25), category: 'Bills', recurring: 'monthly', owner: 'Dad', status: 'upcoming' },
  ];

  await Bill.insertMany(demoBills);

  // Notifications
  const demoNotifications = [
    { user: userObjId, title: 'Shared Account Active', message: 'Son (Sajith) & Dad balances are connected.', type: 'info', read: false },
    { user: userObjId, title: 'Upcoming Bill', message: 'Electricity & Utility bill ₹2,400 due soon.', type: 'bill_due', read: false },
  ];

  await Notification.insertMany(demoNotifications);
};
