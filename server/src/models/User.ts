import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  defaultCurrency: string;
  dateFormat: string;
  theme: string;
  defaultOwner: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    defaultCurrency: { type: String, default: 'INR' }, // 'INR', 'USD', 'EUR', 'GBP'
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    theme: { type: String, default: 'dark' },
    defaultOwner: { type: String, default: 'Me' },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
