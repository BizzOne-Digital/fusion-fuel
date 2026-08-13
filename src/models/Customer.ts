import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { EMAIL_REGEX } from '@/lib/constants';

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  emailVerified: boolean;
  addresses: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
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
    phone: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  },
  { timestamps: true }
);

CustomerSchema.index({ email: 1 }, { unique: true });
CustomerSchema.index({ emailVerified: 1 });

const Customer: Model<ICustomer> =
  mongoose.models.Customer ?? mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
