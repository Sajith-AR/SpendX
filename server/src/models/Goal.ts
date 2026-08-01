import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  category?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true, min: 0 },
    currentAmount: { type: Number, default: 0, min: 0 },
    deadline: { type: Date },
    category: { type: String, default: 'General' },
    icon: { type: String, default: 'Target' },
  },
  { timestamps: true }
);

export default mongoose.model<IGoal>('Goal', GoalSchema);
