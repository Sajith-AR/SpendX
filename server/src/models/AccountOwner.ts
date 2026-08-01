import mongoose, { Schema, Document } from 'mongoose';

export interface IAccountOwner extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  relationship: string; // 'Me', 'Father', 'Mother', 'Spouse', 'Sibling', 'Child', 'Family', 'Other'
  color: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccountOwnerSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    relationship: { type: String, default: 'Family' },
    color: { type: String, default: '#3B82F6' },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AccountOwnerSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model<IAccountOwner>('AccountOwner', AccountOwnerSchema);
