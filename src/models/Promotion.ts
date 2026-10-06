import mongoose, { Document, Model, Schema } from 'mongoose';
import {
  PromotionEligibility,
  PromotionLimits,
  PromotionRules,
  PromotionType,
} from '@/types';

export interface IPromotion extends Document {
  code: string;
  name: string;
  description?: string;
  type: PromotionType;
  rules: PromotionRules;
  eligibility: PromotionEligibility;
  startsAt?: Date;
  endsAt?: Date;
  limits: PromotionLimits;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromotionRulesSchema = new Schema<PromotionRules>(
  {
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrderAmount: { type: Number, min: 0 },
    maximumDiscountAmount: { type: Number, min: 0 },
    applicableProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    applicableCategoryIds: [{ type: Schema.Types.ObjectId, ref: 'ProductCategory' }],
  },
  { _id: false }
);

const PromotionEligibilitySchema = new Schema<PromotionEligibility>(
  {
    firstOrderOnly: { type: Boolean, default: false },
    customerIds: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
    excludedCustomerIds: [{ type: Schema.Types.ObjectId, ref: 'Customer' }],
    requiredProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { _id: false }
);

const PromotionLimitsSchema = new Schema<PromotionLimits>(
  {
    maxUses: { type: Number, min: 1 },
    maxUsesPerCustomer: { type: Number, min: 1 },
    currentUses: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const PromotionSchema = new Schema<IPromotion>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 32,
    },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500 },
    type: {
      type: String,
      enum: ['percentage', 'fixed_amount', 'free_shipping'],
      required: true,
    },
    rules: { type: PromotionRulesSchema, required: true },
    eligibility: { type: PromotionEligibilitySchema, default: () => ({}) },
    startsAt: { type: Date },
    endsAt: { type: Date },
    limits: { type: PromotionLimitsSchema, default: () => ({}) },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PromotionSchema.index({ code: 1 }, { unique: true });
PromotionSchema.index({ active: 1, startsAt: 1, endsAt: 1 });

PromotionSchema.pre('validate', function () {
  if (this.type === 'percentage' && this.rules.discountValue > 100) {
    throw new Error('Percentage discount cannot exceed 100');
  }
  if (this.startsAt && this.endsAt && this.startsAt >= this.endsAt) {
    throw new Error('startsAt must be before endsAt');
  }
});

const Promotion: Model<IPromotion> =
  mongoose.models.Promotion ??
  mongoose.model<IPromotion>('Promotion', PromotionSchema);

export default Promotion;
