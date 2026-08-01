import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  amount: number; // Monthly budget limit
  month: number; // 1 to 12
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

BudgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', BudgetSchema);
