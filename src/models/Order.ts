import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import {
  FulfillmentMethod,
  FulfillmentStatus,
  LocalizedStringSchema,
  OrderLineItem,
  OrderStatus,
  OrderTotals,
  PaymentStatus,
  PickupDetails,
  RefundRecord,
  ShippingAddress,
  StatusHistoryEntry,
} from '@/types';

export interface IOrder extends Document {
  orderNumber: string;
  customerId?: Types.ObjectId;
  guestEmail?: string;
  guestName?: string;
  items: OrderLineItem[];
  totals: OrderTotals;
  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  stripeCustomerId?: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  fulfillmentMethod: FulfillmentMethod;
  shippingAddress?: ShippingAddress;
  pickupDetails?: PickupDetails;
  promotionId?: Types.ObjectId;
  promotionCode?: string;
  discountAmount: number;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  refunds: RefundRecord[];
  customerNotes?: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartAddInSchema = new Schema(
  {
    addInId: { type: Schema.Types.ObjectId, ref: 'AddIn', required: true },
    name: { type: LocalizedStringSchema, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const CartKitConfigSchema = new Schema(
  {
    kitSizeKey: { type: String, required: true, trim: true },
    kitSizeName: { type: LocalizedStringSchema, required: true },
    servings: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderLineItemSchema = new Schema<OrderLineItem>(
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
    refundedQuantity: { type: Number, min: 0, default: 0 },
    refundedAmount: { type: Number, min: 0, default: 0 },
  },
  { _id: true }
);

const OrderTotalsSchema = new Schema<OrderTotals>(
  {
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    shipping: { type: Number, required: true, min: 0, default: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, maxlength: 3 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<ShippingAddress>(
  {
    label: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    street2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'US' },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

const PickupDetailsSchema = new Schema<PickupDetails>(
  {
    locationName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    scheduledAt: { type: Date },
    instructions: { type: String, trim: true },
  },
  { _id: false }
);

const StatusHistoryEntrySchema = new Schema<StatusHistoryEntry>(
  {
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'ready',
        'shipped',
        'delivered',
        'completed',
        'cancelled',
        'refunded',
      ],
      required: true,
    },
    note: { type: String, trim: true },
    changedAt: { type: Date, required: true, default: Date.now },
    changedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { _id: true }
);

const RefundRecordSchema = new Schema<RefundRecord>(
  {
    stripeRefundId: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, trim: true },
    refundedAt: { type: Date, required: true, default: Date.now },
    items: [
      {
        lineItemIndex: { type: Number, min: 0 },
        quantity: { type: Number, min: 0 },
        amount: { type: Number, min: 0 },
      },
    ],
  },
  { _id: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    guestEmail: { type: String, lowercase: true, trim: true },
    guestName: { type: String, trim: true },
    items: { type: [OrderLineItemSchema], required: true, validate: [(v: unknown[]) => v.length > 0, 'Order must have at least one item'] },
    totals: { type: OrderTotalsSchema, required: true },
    stripePaymentIntentId: { type: String, trim: true, sparse: true },
    stripeCheckoutSessionId: { type: String, trim: true, sparse: true },
    stripeCustomerId: { type: String, trim: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    fulfillmentStatus: {
      type: String,
      enum: ['unfulfilled', 'partial', 'fulfilled', 'ready_for_pickup', 'picked_up'],
      default: 'unfulfilled',
    },
    fulfillmentMethod: {
      type: String,
      enum: ['shipping', 'pickup'],
      required: true,
    },
    shippingAddress: ShippingAddressSchema,
    pickupDetails: PickupDetailsSchema,
    promotionId: { type: Schema.Types.ObjectId, ref: 'Promotion' },
    promotionCode: { type: String, trim: true, uppercase: true },
    discountAmount: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'ready',
        'shipped',
        'delivered',
        'completed',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    statusHistory: { type: [StatusHistoryEntrySchema], default: [] },
    refunds: { type: [RefundRecordSchema], default: [] },
    customerNotes: { type: String, trim: true, maxlength: 1000 },
    internalNotes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });

OrderSchema.pre('validate', function () {
  if (!this.customerId && !this.guestEmail) {
    throw new Error('Order must have either customerId or guestEmail');
  }
  if (this.fulfillmentMethod === 'shipping' && !this.shippingAddress) {
    throw new Error('Shipping address is required for shipping orders');
  }
  if (this.fulfillmentMethod === 'pickup' && !this.pickupDetails) {
    throw new Error('Pickup details are required for pickup orders');
  }
});

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
