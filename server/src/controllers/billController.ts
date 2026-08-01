import { Response } from 'express';
import Bill from '../models/Bill';
import { AuthRequest } from '../middleware/authMiddleware';

export const getBills = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const bills = await Bill.find({ user: userId }).sort({ dueDate: 1 });

    const now = new Date();
    // Update statuses dynamically
    const updatedBills = bills.map((b) => {
      const obj = b.toObject();
      if (obj.status !== 'paid') {
        const diffDays = Math.ceil((new Date(obj.dueDate).getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (diffDays < 0) obj.status = 'overdue';
        else if (diffDays <= 5) obj.status = 'upcoming';
        else obj.status = 'upcoming';
      }
      return obj;
    });

    res.json({ success: true, bills: updatedBills });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBill = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, amount, dueDate, category = 'Bills', recurring = 'monthly', owner = 'Me' } = req.body;

    if (!name || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: 'Name, amount, and due date are required.' });
    }

    const bill = await Bill.create({
      user: userId,
      name,
      amount: Number(amount),
      dueDate: new Date(dueDate),
      category,
      recurring,
      owner,
      status: 'upcoming',
    });

    res.status(201).json({ success: true, bill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBillStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status } = req.body; // 'paid', 'upcoming', 'overdue'

    const bill = await Bill.findOne({ _id: id, user: userId });
    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found.' });

    if (status) bill.status = status;
    await bill.save();

    res.json({ success: true, bill });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBill = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    await Bill.findOneAndDelete({ _id: id, user: userId });
    res.json({ success: true, message: 'Bill deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
