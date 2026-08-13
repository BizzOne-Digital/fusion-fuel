import { Types } from 'mongoose';
import Promotion, { type IPromotion } from '@/models/Promotion';
import Order from '@/models/Order';
import type { FulfillmentMethod } from '@/types';

export interface PromotionValidationContext {
  code: string;
  customerId?: Types.ObjectId;
  subtotal: number;
  itemCount: number;
  productIds: Types.ObjectId[];
  fulfillmentMethod: FulfillmentMethod;
}

export interface PromotionValidationResult {
  valid: boolean;
  reason?: string;
  discountAmount: number;
  freeShippingApplied: boolean;
  promotion?: {
    id: string;
    code: string;
    type: IPromotion['type'];
  };
}

function isWithinDateWindow(promotion: IPromotion, now = new Date()): boolean {
  if (promotion.startsAt && now < promotion.startsAt) {
    return false;
  }

  if (promotion.endsAt && now > promotion.endsAt) {
    return false;
  }

  return true;
}

function calculateDiscountAmount(
  promotion: IPromotion,
  subtotal: number
): { discountAmount: number; freeShippingApplied: boolean } {
  const { type, rules } = promotion;

  if (type === 'free_shipping') {
    return { discountAmount: 0, freeShippingApplied: true };
  }

  if (type === 'percentage') {
    let discountAmount = Math.round((subtotal * rules.discountValue) / 100);

    if (rules.maximumDiscountAmount !== undefined) {
      discountAmount = Math.min(discountAmount, rules.maximumDiscountAmount);
    }

    return { discountAmount: Math.min(discountAmount, subtotal), freeShippingApplied: false };
  }

  const fixedDiscount = Math.min(rules.discountValue, subtotal);
  return { discountAmount: fixedDiscount, freeShippingApplied: false };
}

async function passesEligibility(
  promotion: IPromotion,
  context: PromotionValidationContext
): Promise<{ ok: boolean; reason?: string }> {
  const { eligibility, limits } = promotion;

  if (limits.maxUses !== undefined && (limits.currentUses ?? 0) >= limits.maxUses) {
    return { ok: false, reason: 'Promotion usage limit reached' };
  }

  if (context.customerId) {
    if (
      eligibility.excludedCustomerIds?.some((id) => id.equals(context.customerId!))
    ) {
      return { ok: false, reason: 'Promotion not available for this customer' };
    }

    if (
      eligibility.customerIds?.length &&
      !eligibility.customerIds.some((id) => id.equals(context.customerId!))
    ) {
      return { ok: false, reason: 'Promotion not available for this customer' };
    }

    if (eligibility.firstOrderOnly) {
      const existingPaidOrder = await Order.exists({
        customerId: context.customerId,
        paymentStatus: 'paid',
      });

      if (existingPaidOrder) {
        return { ok: false, reason: 'Promotion valid for first order only' };
      }
    }
  } else if (eligibility.firstOrderOnly) {
    return { ok: false, reason: 'Sign in required for this promotion' };
  }

  if (eligibility.requiredProductIds?.length) {
    const requiredIds = eligibility.requiredProductIds.map((id) => id.toString());
    const cartProductIds = context.productIds.map((id) => id.toString());
    const hasRequired = requiredIds.every((requiredId) => cartProductIds.includes(requiredId));

    if (!hasRequired) {
      return { ok: false, reason: 'Required products missing for promotion' };
    }
  }

  if (promotion.rules.applicableProductIds?.length) {
    const applicableIds = promotion.rules.applicableProductIds.map((id) => id.toString());
    const hasApplicable = context.productIds.some((id) => applicableIds.includes(id.toString()));

    if (!hasApplicable) {
      return { ok: false, reason: 'Promotion not applicable to cart items' };
    }
  }

  return { ok: true };
}

export async function validatePromotion(
  promotion: IPromotion,
  context: PromotionValidationContext
): Promise<PromotionValidationResult> {
  if (!promotion.active) {
    return {
      valid: false,
      reason: 'Promotion is inactive',
      discountAmount: 0,
      freeShippingApplied: false,
    };
  }

  if (!isWithinDateWindow(promotion)) {
    return {
      valid: false,
      reason: 'Promotion is not currently available',
      discountAmount: 0,
      freeShippingApplied: false,
    };
  }

  if (
    promotion.rules.minimumOrderAmount !== undefined &&
    context.subtotal < promotion.rules.minimumOrderAmount
  ) {
    return {
      valid: false,
      reason: 'Minimum order amount not met',
      discountAmount: 0,
      freeShippingApplied: false,
    };
  }

  const eligibility = await passesEligibility(promotion, context);
  if (!eligibility.ok) {
    return {
      valid: false,
      reason: eligibility.reason,
      discountAmount: 0,
      freeShippingApplied: false,
    };
  }

  const { discountAmount, freeShippingApplied } = calculateDiscountAmount(
    promotion,
    context.subtotal
  );

  return {
    valid: true,
    discountAmount,
    freeShippingApplied,
    promotion: {
      id: promotion._id.toString(),
      code: promotion.code,
      type: promotion.type,
    },
  };
}

export async function incrementPromotionUsage(promotionId: string): Promise<void> {
  await Promotion.updateOne({ _id: promotionId }, { $inc: { 'limits.currentUses': 1 } });
}
