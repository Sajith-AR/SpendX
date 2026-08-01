import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'budget_warning' | 'bill_due' | 'goal_reached' | 'large_expense' | 'info';
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['budget_warning', 'bill_due', 'goal_reached', 'large_expense', 'info'], default: 'info' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
