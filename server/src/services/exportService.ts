import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

export const generateCSVExport = async (userId: string, filter: any): Promise<string> => {
  const userObjId = new mongoose.Types.ObjectId(userId);
  const query: any = { user: userObjId };

  if (filter.owner && filter.owner !== 'All') query.owner = filter.owner;
  if (filter.startDate || filter.endDate) {
    query.date = {};
    if (filter.startDate) query.date.$gte = new Date(filter.startDate);
    if (filter.endDate) query.date.$lte = new Date(filter.endDate);
  }

  const transactions = await Transaction.find(query).sort({ date: -1 });

  const headers = ['Date', 'Owner', 'Type', 'Category', 'Description', 'Payment Method', 'Amount', 'Notes'];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString(),
    `"${t.owner}"`,
    t.type,
    `"${t.category}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    t.paymentMethod,
    t.amount,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
