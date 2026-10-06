import { Types } from 'mongoose';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Promotion from '@/models/Promotion';
import type { CartItem, FulfillmentMethod, OrderTotals, PromotionType } from '@/types';
import { DEFAULT_CURRENCY } from '@/lib/constants';
import {
  validatePromotion,
  type PromotionValidationContext,
  type PromotionValidationResult,
} from '@/lib/promotions';

export interface PricingLineItem extends CartItem {
  lineTotal: number;
}

export interface CalculateOrderPricingInput {
  items: CartItem[];
  fulfillmentMethod: FulfillmentMethod;
  promotionCode?: string;
  customerId?: string;
  shippingFlatRate?: number;
  freeShippingThreshold?: number;
  taxRateBps?: number;
  currency?: string;
}

export interface CalculateOrderPricingResult {
  items: PricingLineItem[];
  totals: OrderTotals;
  promotion?: PromotionValidationResult['promotion'];
  promotionDiscount: number;
  freeShippingApplied: boolean;
}

function calculateLineTotal(item: CartItem): number {
  const addInTotal =
    item.addIns?.reduce((sum, addIn) => sum + addIn.unitPrice * addIn.quantity, 0) ?? 0;
  const unitTotal = item.unitPrice + addInTotal;
  return unitTotal * item.quantity;
}

function calculateShipping(
  subtotal: number,
  fulfillmentMethod: FulfillmentMethod,
  freeShippingApplied: boolean,
  shippingFlatRate = 0,
  freeShippingThreshold?: number
): number {
  if (fulfillmentMethod === 'pickup' || freeShippingApplied) {
    return 0;
  }

  if (freeShippingThreshold !== undefined && subtotal >= freeShippingThreshold) {
    return 0;
  }

  return Math.max(0, shippingFlatRate);
}

function calculateTax(taxableAmount: number, taxRateBps = 0): number {
  if (taxRateBps <= 0 || taxableAmount <= 0) {
    return 0;
  }

  return Math.round((taxableAmount * taxRateBps) / 10000);
}

export async function calculateOrderPricing(
  input: CalculateOrderPricingInput
): Promise<CalculateOrderPricingResult> {
  const currency = input.currency ?? DEFAULT_CURRENCY;

  const pricedItems: PricingLineItem[] = input.items.map((item) => ({
    ...item,
    lineTotal: calculateLineTotal(item),
  }));

  const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  let promotionResult: PromotionValidationResult | null = null;
  let promotionDiscount = 0;
  let freeShippingApplied = false;

  if (input.promotionCode) {
    await connectDB();

    const promotion = await Promotion.findOne({
      code: input.promotionCode.trim().toUpperCase(),
      active: true,
    });

    if (promotion) {
      const context: PromotionValidationContext = {
        code: promotion.code,
        customerId: input.customerId ? new Types.ObjectId(input.customerId) : undefined,
        subtotal,
        itemCount: pricedItems.reduce((sum, item) => sum + item.quantity, 0),
        productIds: pricedItems.map((item) => item.productId),
        fulfillmentMethod: input.fulfillmentMethod,
      };

      promotionResult = await validatePromotion(promotion, context);

      if (promotionResult.valid) {
        promotionDiscount = promotionResult.discountAmount;
        freeShippingApplied = promotionResult.freeShippingApplied;
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - promotionDiscount);

  const shipping = calculateShipping(
    discountedSubtotal,
    input.fulfillmentMethod,
    freeShippingApplied,
    input.shippingFlatRate,
    input.freeShippingThreshold
  );

  const tax = calculateTax(discountedSubtotal + shipping, input.taxRateBps);

  const total = Math.max(0, discountedSubtotal + shipping + tax);

  const totals: OrderTotals = {
    subtotal,
    discount: promotionDiscount,
    shipping,
    tax,
    total,
    currency,
  };

  return {
    items: pricedItems,
    totals,
    promotion: promotionResult?.valid ? promotionResult.promotion : undefined,
    promotionDiscount,
    freeShippingApplied,
  };
}

export function summarizeLineItemsForEmail(
  items: PricingLineItem[],
  locale: 'en' | 'es' = 'en'
): string {
  return items
    .map((item) => {
      const name = item.productName[locale] ?? item.productName.en;
      return `${item.quantity}x ${name} — ${formatMinorUnits(item.lineTotal)}`;
    })
    .join('\n');
}

export function formatMinorUnits(amount: number, currency = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export type { PromotionType };
