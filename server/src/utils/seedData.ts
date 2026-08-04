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

  // Create core Father & Son shared account owners with initial balances (Son = 200, Dad = 500 => Total = 700)
  const defaultOwners = [
    { user: userObjId, name: 'Son (Sajith)', relationship: 'Me', color: '#14F195', initialBalance: 200, isSystem: true },
    { user: userObjId, name: 'Dad', relationship: 'Father', color: '#3B82F6', initialBalance: 500, isSystem: true },
    { user: userObjId, name: 'Family', relationship: 'Family', color: '#F59E0B', initialBalance: 0, isSystem: true },
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
    // Clean initial demo transactions
    { user: userObjId, owner: 'Son (Sajith)', type: 'expense', amount: 20, category: 'Food', description: 'Coffee & Snacks', date: subDays(0), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Dad', type: 'expense', amount: 50, category: 'Bills', description: 'Utility Bill', date: subDays(1), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Son (Sajith)', type: 'income', amount: 100, category: 'Allowance / Salary', description: 'Weekly Earnings', date: subDays(2), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Dad', type: 'income', amount: 200, category: 'Business Income', description: 'Client Payment', date: subDays(3), paymentMethod: 'Bank Transfer' },
  ];

  await Transaction.insertMany(demoTransactions);

  // Budgets
  const demoBudgets = [
    { user: userObjId, category: 'Food', amount: 500, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Bills', amount: 1000, month: currentMonth, year: currentYear },
  ];
  await Budget.insertMany(demoBudgets);

  // Goals
  const demoGoals = [
    { user: userObjId, name: 'Dad & Son Emergency Reserve', targetAmount: 5000, currentAmount: 700, category: 'Savings', icon: 'Shield', deadline: new Date(currentYear, 11, 31) },
  ];
  await Goal.insertMany(demoGoals);

  // Bills
  const demoBills = [
    { user: userObjId, name: 'Utility & Internet', amount: 150, dueDate: new Date(currentYear, currentMonth - 1, 28), category: 'Bills', recurring: 'monthly', owner: 'Dad', status: 'upcoming' },
  ];
  await Bill.insertMany(demoBills);

  // Notifications
  const demoNotifications = [
    { user: userObjId, title: 'Shared Account Connected', message: 'Son (Sajith) ₹200 + Dad ₹500 = Total ₹700.', type: 'info', read: false },
  ];
  await Notification.insertMany(demoNotifications);
};
