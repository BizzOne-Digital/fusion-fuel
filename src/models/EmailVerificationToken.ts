import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { EMAIL_VERIFICATION_EXPIRY_HOURS } from '@/lib/constants';

export interface IEmailVerificationToken extends Document {
  customerId: Types.ObjectId;
  email: string;
  tokenHash: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationTokenSchema = new Schema<IEmailVerificationToken>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    tokenHash: { type: String, required: true, select: false },
    expiresAt: {
      type: Date,
      required: true,
      default: () =>
        new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000),
    },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

EmailVerificationTokenSchema.index({ tokenHash: 1 });
EmailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
EmailVerificationTokenSchema.index({ customerId: 1, email: 1 });

const EmailVerificationToken: Model<IEmailVerificationToken> =
  mongoose.models.EmailVerificationToken ??
  mongoose.model<IEmailVerificationToken>(
    'EmailVerificationToken',
    EmailVerificationTokenSchema
  );

export default EmailVerificationToken;
