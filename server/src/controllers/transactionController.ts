import { Response } from 'express';
import Transaction from '../models/Transaction';
import AccountOwner from '../models/AccountOwner';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { owner, type, category, startDate, endDate, month, year, search, minAmount, maxAmount, page = 1, limit = 100 } = req.query;

    const query: any = { user: new mongoose.Types.ObjectId(userId) };

    if (owner && owner !== 'All') {
      query.owner = owner;
    }
    if (type && type !== 'All') {
      query.type = type;
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    } else if (month && year) {
      const m = parseInt(month as string, 10);
      const y = parseInt(year as string, 10);
      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [{ description: searchRegex }, { category: searchRegex }, { owner: searchRegex }, { notes: searchRegex }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { owner = 'Son (Sajith)', type, amount, category, description, date, paymentMethod, notes } = req.body;

    if (!type || !amount || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide type, amount, category, and description.' });
    }

    const transaction = await Transaction.create({
      user: userId,
      owner,
      type,
      amount: Number(amount),
      category,
      description,
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'UPI',
      notes,
    });

    res.status(201).json({ success: true, transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    let transaction = await Transaction.findOne({ _id: id, user: userId });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    const { owner, type, amount, category, description, date, paymentMethod, notes } = req.body;

    if (owner) transaction.owner = owner;
    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = Number(amount);
    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (date) transaction.date = new Date(date);
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (notes !== undefined) transaction.notes = notes;

    await transaction.save();

    res.json({ success: true, transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found.' });
    }

    res.json({ success: true, message: 'Transaction deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFinancialSummary = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.id);
    const { owner } = req.query;

    // Fetch account owners to retrieve initial balances
    const ownersList = await AccountOwner.find({ user: userId });

    const matchOwnerFilter: any = owner && owner !== 'All' ? { owner } : {};

    const pipeline = [
      { $match: { user: userId, ...matchOwnerFilter } },
      {
        $group: {
          _id: { type: '$type', owner: '$owner' },
          total: { $sum: '$amount' },
        },
      },
    ];

    const results = await Transaction.aggregate(pipeline);

    let totalIncome = 0;
    let totalExpense = 0;
    let myIncome = 0;
    let myExpense = 0;
    let dadIncome = 0;
    let dadExpense = 0;
    let familyIncome = 0;
    let familyExpense = 0;

    const ownerBreakdown: Record<string, { initialBalance: number; income: number; expense: number; balance: number }> = {};

    // Initialize breakdown from AccountOwner records
    ownersList.forEach((o) => {
      ownerBreakdown[o.name] = {
        initialBalance: o.initialBalance || 0,
        income: 0,
        expense: 0,
        balance: o.initialBalance || 0,
      };
    });

    results.forEach((item) => {
      const ownerName = item._id.owner;
      const type = item._id.type;
      const amt = item.total;

      if (!ownerBreakdown[ownerName]) {
        ownerBreakdown[ownerName] = { initialBalance: 0, income: 0, expense: 0, balance: 0 };
      }

      if (type === 'income') {
        ownerBreakdown[ownerName].income += amt;
        totalIncome += amt;
        if (ownerName.toLowerCase().includes('dad') || ownerName.toLowerCase().includes('father')) {
          dadIncome += amt;
        } else if (ownerName.toLowerCase().includes('son') || ownerName.toLowerCase().includes('me') || ownerName.toLowerCase().includes('sajith')) {
          myIncome += amt;
        } else {
          familyIncome += amt;
        }
      } else {
        ownerBreakdown[ownerName].expense += amt;
        totalExpense += amt;
        if (ownerName.toLowerCase().includes('dad') || ownerName.toLowerCase().includes('father')) {
          dadExpense += amt;
        } else if (ownerName.toLowerCase().includes('son') || ownerName.toLowerCase().includes('me') || ownerName.toLowerCase().includes('sajith')) {
          myExpense += amt;
        } else {
          familyExpense += amt;
        }
      }

      ownerBreakdown[ownerName].balance =
        (ownerBreakdown[ownerName].initialBalance || 0) +
        ownerBreakdown[ownerName].income -
        ownerBreakdown[ownerName].expense;
    });

    let totalInitial = 0;
    Object.values(ownerBreakdown).forEach((o) => {
      totalInitial += o.initialBalance || 0;
    });

    const sonOwner = Object.keys(ownerBreakdown).find(k => k.toLowerCase().includes('son') || k.toLowerCase().includes('me') || k.toLowerCase().includes('sajith'));
    const dadOwner = Object.keys(ownerBreakdown).find(k => k.toLowerCase().includes('dad') || k.toLowerCase().includes('father'));

    const sonInitial = sonOwner ? ownerBreakdown[sonOwner].initialBalance : 45000;
    const dadInitial = dadOwner ? ownerBreakdown[dadOwner].initialBalance : 150000;

    const sonBalance = sonInitial + myIncome - myExpense;
    const dadBalance = dadInitial + dadIncome - dadExpense;
    const familyBalance = (ownerBreakdown['Family']?.initialBalance || 0) + familyIncome - familyExpense;

    const totalBalance = totalInitial + totalIncome - totalExpense;
    const savings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((savings / totalIncome) * 100)) : 0;

    res.json({
      success: true,
      summary: {
        totalBalance,
        myBalance: sonBalance,
        sonBalance,
        dadBalance,
        familyBalance,
        totalIncome,
        totalExpense,
        myIncome,
        myExpense,
        familyIncome,
        familyExpense,
        savings,
        savingsRate,
        ownerBreakdown,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
