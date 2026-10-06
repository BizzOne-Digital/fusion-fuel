import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { PASSWORD_RESET_EXPIRY_HOURS } from '@/lib/constants';

export interface IPasswordResetToken extends Document {
  userId: Types.ObjectId;
  userType: 'customer' | 'admin';
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    userType: {
      type: String,
      enum: ['customer', 'admin'],
      required: true,
    },
    tokenHash: { type: String, required: true, select: false },
    expiresAt: {
      type: Date,
      required: true,
      default: () =>
        new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000),
    },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

PasswordResetTokenSchema.index({ tokenHash: 1 });
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
PasswordResetTokenSchema.index({ userId: 1, userType: 1 });

PasswordResetTokenSchema.pre('validate', function () {
  if (this.usedAt && this.usedAt > this.expiresAt) {
    throw new Error('Token cannot be used after expiry');
  }
});

const PasswordResetToken: Model<IPasswordResetToken> =
  mongoose.models.PasswordResetToken ??
  mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetToken;
