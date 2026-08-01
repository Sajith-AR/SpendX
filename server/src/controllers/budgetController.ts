import { Response } from 'express';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.id);
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const budgets = await Budget.find({ user: userId, month, year });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Calculate actual spent per category in this month
    const categorySpending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const spentMap: Record<string, number> = {};
    categorySpending.forEach((item) => {
      spentMap[item._id] = item.spent;
    });

    const detailedBudgets = budgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      const remaining = b.amount - spent;
      const percentage = Math.min(100, Math.round((spent / b.amount) * 100));

      let alertStatus: 'normal' | 'warning' | 'critical' | 'exceeded' = 'normal';
      if (percentage >= 100) alertStatus = 'exceeded';
      else if (percentage >= 90) alertStatus = 'critical';
      else if (percentage >= 80) alertStatus = 'warning';

      return {
        _id: b._id,
        category: b.category,
        amount: b.amount,
        spent,
        remaining,
        percentage,
        alertStatus,
        month: b.month,
        year: b.year,
      };
    });

    res.json({ success: true, budgets: detailedBudgets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrUpdateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { category, amount, month, year } = req.body;

    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    if (!category || !amount) {
      return res.status(400).json({ success: false, message: 'Category and amount are required.' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: userId, category, month: targetMonth, year: targetYear },
      { amount: Number(amount) },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, budget });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    await Budget.findOneAndDelete({ _id: id, user: userId });
    res.json({ success: true, message: 'Budget deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
