import { z } from 'zod';
import { EMAIL_REGEX } from '@/lib/constants';

const addressSchema = z.object({
  name: z.string().trim().min(2).max(120),
  street: z.string().trim().min(3).max(200),
  street2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(50),
  zip: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(2).default('US'),
  phone: z.string().trim().max(30).optional(),
});

export const checkoutSchema = z
  .object({
    fulfillmentMethod: z.enum(['shipping', 'pickup']),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .regex(EMAIL_REGEX, 'Invalid email address'),
    customerNotes: z.string().trim().max(1000).optional(),
    promotionCode: z.string().trim().max(50).optional(),
    shippingAddress: addressSchema.optional(),
    pickupLocationName: z.string().trim().max(200).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentMethod === 'shipping' && !data.shippingAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Shipping address is required',
        path: ['shippingAddress'],
      });
    }

    if (data.fulfillmentMethod === 'pickup' && !data.pickupLocationName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pickup location is required',
        path: ['pickupLocationName'],
      });
    }
  });

export const cartItemInputSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
  variantSku: z.string().trim().optional(),
  flavorIds: z.array(z.string().trim()).optional(),
  addIns: z
    .array(
      z.object({
        addInId: z.string().trim().min(1),
        quantity: z.coerce.number().int().min(1).max(20),
      })
    )
    .optional(),
  kitSizeKey: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional(),
});

export const cartUpdateSchema = z.object({
  items: z.array(cartItemInputSchema).min(1),
  promotionCode: z.string().trim().max(50).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CartItemInput = z.infer<typeof cartItemInputSchema>;
export type CartUpdateInput = z.infer<typeof cartUpdateSchema>;
