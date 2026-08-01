import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  owner: string; // e.g. "Me", "Father", "Mother", "Family"
  type: 'income' | 'expense';
  amount: number;
  category: string; // Food, Transport, Shopping, Bills, Education, Health, Entertainment, Salary, Investment, Recharge, Other
  description: string;
  date: Date;
  paymentMethod: string; // Cash, Credit Card, Debit Card, UPI, Bank Transfer
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    owner: { type: String, required: true, default: 'Me', index: true },
    type: { type: String, enum: ['income', 'expense'], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    paymentMethod: { type: String, default: 'UPI' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, owner: 1, date: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
