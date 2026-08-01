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

  // Clear existing transactions, budgets, goals, bills for this user
  await Transaction.deleteMany({ user: userObjId });
  await Budget.deleteMany({ user: userObjId });
  await Goal.deleteMany({ user: userObjId });
  await Bill.deleteMany({ user: userObjId });
  await Notification.deleteMany({ user: userObjId });

  // Ensure default owners exist
  const existingOwners = await AccountOwner.find({ user: userObjId });
  if (existingOwners.length === 0) {
    const defaultOwners = [
      { user: userObjId, name: 'Me', relationship: 'Me', color: '#14F195', isSystem: true },
      { user: userObjId, name: 'Father', relationship: 'Father', color: '#3B82F6', isSystem: true },
      { user: userObjId, name: 'Mother', relationship: 'Mother', color: '#8B5CF6', isSystem: true },
      { user: userObjId, name: 'Family', relationship: 'Family', color: '#F59E0B', isSystem: true },
    ];
    await AccountOwner.insertMany(defaultOwners);
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  // Helper to subtract days
  const subDays = (d: number) => {
    const date = new Date();
    date.setDate(date.getDate() - d);
    return date;
  };

  // Helper for explicit date (e.g., 2026-07-05)
  const createDate = (year: number, month: number, day: number) => {
    return new Date(year, month - 1, day, 12, 0, 0);
  };

  const demoTransactions = [
    // Today / Recent
    { user: userObjId, owner: 'Me', type: 'expense', amount: 120, category: 'Food', description: 'Coffee & Snacks', date: subDays(0), paymentMethod: 'UPI', notes: 'Starbucks' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 60, category: 'Transport', description: 'Metro Ride', date: subDays(0), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Father', type: 'expense', amount: 2400, category: 'Bills', description: 'Electricity Bill', date: subDays(1), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Me', type: 'income', amount: 85000, category: 'Salary', description: 'Monthly Salary Credit', date: subDays(2), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Mother', type: 'expense', amount: 3500, category: 'Shopping', description: 'Grocery Store', date: subDays(3), paymentMethod: 'Credit Card' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 1499, category: 'Recharge', description: 'Broadband Fiber Bill', date: subDays(4), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Family', type: 'expense', amount: 4200, category: 'Entertainment', description: 'Weekend Dinner & Movies', date: subDays(5), paymentMethod: 'Credit Card' },

    // Explicit date: 07/05/2026 (5 July 2026) as per prompt requirement!
    { user: userObjId, owner: 'Me', type: 'expense', amount: 120, category: 'Food', description: 'Coffee', date: createDate(2026, 7, 5), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 60, category: 'Transport', description: 'Metro', date: createDate(2026, 7, 5), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Father', type: 'expense', amount: 1500, category: 'Health', description: 'Pharmacy Prescription', date: createDate(2026, 7, 6), paymentMethod: 'Cash' },

    // June 2026 data for month comparison!
    { user: userObjId, owner: 'Me', type: 'income', amount: 85000, category: 'Salary', description: 'June Salary Credit', date: createDate(2026, 6, 1), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 4800, category: 'Food', description: 'June Dining & Groceries', date: createDate(2026, 6, 12), paymentMethod: 'Credit Card' },
    { user: userObjId, owner: 'Father', type: 'expense', amount: 12000, category: 'Bills', description: 'House Maintenance', date: createDate(2026, 6, 15), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Mother', type: 'expense', amount: 6500, category: 'Shopping', description: 'Summer Apparel', date: createDate(2026, 6, 20), paymentMethod: 'Credit Card' },

    // July 2026 data
    { user: userObjId, owner: 'Me', type: 'income', amount: 85000, category: 'Salary', description: 'July Salary Credit', date: createDate(2026, 7, 1), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Father', type: 'income', amount: 45000, category: 'Investment', description: 'Pension & Dividend Return', date: createDate(2026, 7, 2), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 3250, category: 'Food', description: 'Supermarket Groceries', date: createDate(2026, 7, 4), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 850, category: 'Transport', description: 'Cab Fares', date: createDate(2026, 7, 8), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Father', type: 'expense', amount: 5500, category: 'Education', description: 'Course Material', date: createDate(2026, 7, 10), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Mother', type: 'expense', amount: 2800, category: 'Health', description: 'Health Checkup', date: createDate(2026, 7, 14), paymentMethod: 'Debit Card' },

    // Scatter transactions across last 30 days for rich Heatmap
    { user: userObjId, owner: 'Me', type: 'expense', amount: 350, category: 'Food', description: 'Lunch Express', date: subDays(8), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Father', type: 'expense', amount: 8500, category: 'Bills', description: 'Insurance Premium', date: subDays(11), paymentMethod: 'Bank Transfer' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 1200, category: 'Shopping', description: 'Book Order', date: subDays(14), paymentMethod: 'Credit Card' },
    { user: userObjId, owner: 'Mother', type: 'expense', amount: 4500, category: 'Food', description: 'Organic Pantry Store', date: subDays(18), paymentMethod: 'UPI' },
    { user: userObjId, owner: 'Me', type: 'expense', amount: 18500, category: 'Shopping', description: 'Ergonomic Desk Chair', date: subDays(22), paymentMethod: 'Credit Card' },
  ];

  await Transaction.insertMany(demoTransactions);

  // Budgets for current month
  const demoBudgets = [
    { user: userObjId, category: 'Food', amount: 5000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Bills', amount: 15000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Shopping', amount: 10000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Transport', amount: 4000, month: currentMonth, year: currentYear },
    { user: userObjId, category: 'Entertainment', amount: 6000, month: currentMonth, year: currentYear },
  ];

  await Budget.insertMany(demoBudgets);

  // Goals
  const demoGoals = [
    { user: userObjId, name: 'New Laptop', targetAmount: 80000, currentAmount: 45000, category: 'Electronics', icon: 'Laptop', deadline: new Date(currentYear, 11, 31) },
    { user: userObjId, name: 'Emergency Fund', targetAmount: 150000, currentAmount: 110000, category: 'Savings', icon: 'Shield', deadline: new Date(currentYear + 1, 5, 30) },
    { user: userObjId, name: 'Family Vacation', targetAmount: 100000, currentAmount: 35000, category: 'Travel', icon: 'Plane', deadline: new Date(currentYear, 9, 15) },
  ];

  await Goal.insertMany(demoGoals);

  // Bills
  const demoBills = [
    { user: userObjId, name: 'Fiber Internet', amount: 1499, dueDate: new Date(currentYear, currentMonth - 1, 28), category: 'Bills', recurring: 'monthly', owner: 'Me', status: 'upcoming' },
    { user: userObjId, name: 'Electricity Bill', amount: 2400, dueDate: new Date(currentYear, currentMonth - 1, 25), category: 'Bills', recurring: 'monthly', owner: 'Father', status: 'upcoming' },
    { user: userObjId, name: 'Health Insurance', amount: 12000, dueDate: new Date(currentYear, currentMonth, 10), category: 'Health', recurring: 'yearly', owner: 'Family', status: 'upcoming' },
  ];

  await Bill.insertMany(demoBills);

  // Notifications
  const demoNotifications = [
    { user: userObjId, title: 'Budget Warning', message: 'Food budget has reached 65% of monthly limit.', type: 'budget_warning', read: false },
    { user: userObjId, title: 'Upcoming Bill', message: 'Fiber Internet bill ₹1,499 due soon.', type: 'bill_due', read: false },
    { user: userObjId, title: 'Goal Milestone', message: 'Emergency Fund is 73% complete!', type: 'goal_reached', read: true },
  ];

  await Notification.insertMany(demoNotifications);
};
