import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import {
  CartAddIn,
  CartItem,
  CartKitConfig,
  LocalizedStringSchema,
} from '@/types';

export interface ICart extends Document {
  sessionId?: string;
  customerId?: Types.ObjectId;
  items: CartItem[];
  currency: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartAddInSchema = new Schema<CartAddIn>(
  {
    addInId: { type: Schema.Types.ObjectId, ref: 'AddIn', required: true },
    name: { type: LocalizedStringSchema, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartKitConfigSchema = new Schema<CartKitConfig>(
  {
    kitSizeKey: { type: String, required: true, trim: true },
    kitSizeName: { type: LocalizedStringSchema, required: true },
    servings: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartItemSchema = new Schema<CartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: LocalizedStringSchema, required: true },
    productSlug: { type: String, required: true, trim: true },
    sku: { type: String, trim: true, uppercase: true },
    variantSku: { type: String, trim: true, uppercase: true },
    variantName: LocalizedStringSchema,
    flavorIds: [{ type: Schema.Types.ObjectId, ref: 'Flavor' }],
    flavorNames: [LocalizedStringSchema],
    addIns: { type: [CartAddInSchema], default: [] },
    kitConfig: CartKitConfigSchema,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    sessionId: { type: String, trim: true, sparse: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', sparse: true },
    items: { type: [CartItemSchema], default: [] },
    currency: { type: String, default: 'USD', uppercase: true, maxlength: 3 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

CartSchema.index(
  { sessionId: 1 },
  { unique: true, partialFilterExpression: { sessionId: { $type: 'string' } } }
);
CartSchema.index(
  { customerId: 1 },
  { unique: true, partialFilterExpression: { customerId: { $exists: true } } }
);
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

CartSchema.pre('validate', function () {
  if (!this.sessionId && !this.customerId) {
    throw new Error('Cart must have either sessionId or customerId');
  }
});

const Cart: Model<ICart> =
  mongoose.models.Cart ?? mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
