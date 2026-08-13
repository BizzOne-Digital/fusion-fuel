import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { EMAIL_REGEX } from '@/lib/constants';
import type { AdminRole } from '@/types';

export interface IAdminUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Invalid email address'],
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'editor'],
      default: 'admin',
      required: true,
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

AdminUserSchema.index({ email: 1 }, { unique: true });
AdminUserSchema.index({ role: 1 });

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ??
  mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
