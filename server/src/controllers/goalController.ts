import { Response } from 'express';
import Goal from '../models/Goal';
import { AuthRequest } from '../middleware/authMiddleware';

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const goals = await Goal.find({ user: userId }).sort({ createdAt: -1 });

    const formattedGoals = goals.map((g) => {
      const progress = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
      return {
        ...g.toObject(),
        progress,
      };
    });

    res.json({ success: true, goals: formattedGoals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, targetAmount, currentAmount = 0, deadline, category = 'General', icon = 'Target' } = req.body;

    if (!name || !targetAmount) {
      return res.status(400).json({ success: false, message: 'Goal name and target amount are required.' });
    }

    const goal = await Goal.create({
      user: userId,
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      deadline: deadline ? new Date(deadline) : undefined,
      category,
      icon,
    });

    res.status(201).json({ success: true, goal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, targetAmount, currentAmount, deadline, category, icon } = req.body;

    const goal = await Goal.findOne({ _id: id, user: userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found.' });

    if (name) goal.name = name;
    if (targetAmount !== undefined) goal.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = Number(currentAmount);
    if (deadline) goal.deadline = new Date(deadline);
    if (category) goal.category = category;
    if (icon) goal.icon = icon;

    await goal.save();
    res.json({ success: true, goal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMoneyToGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required.' });
    }

    const goal = await Goal.findOne({ _id: id, user: userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found.' });

    goal.currentAmount += Number(amount);
    await goal.save();

    res.json({ success: true, goal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    await Goal.findOneAndDelete({ _id: id, user: userId });
    res.json({ success: true, message: 'Goal deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
