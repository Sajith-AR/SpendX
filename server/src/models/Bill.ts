import mongoose, { Schema, Document } from 'mongoose';

export interface IBill extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  recurring: 'none' | 'monthly' | 'quarterly' | 'yearly';
  owner: string;
  status: 'upcoming' | 'paid' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true, index: true },
    category: { type: String, default: 'Bills' },
    recurring: { type: String, enum: ['none', 'monthly', 'quarterly', 'yearly'], default: 'monthly' },
    owner: { type: String, default: 'Me' },
    status: { type: String, enum: ['upcoming', 'paid', 'overdue'], default: 'upcoming' },
  },
  { timestamps: true }
);

export default mongoose.model<IBill>('Bill', BillSchema);
