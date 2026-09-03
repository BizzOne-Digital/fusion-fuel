import { Types } from 'mongoose';
import connectDB from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import AddIn from '@/models/AddIn';
import Flavor from '@/models/Flavor';
import { calculateOrderPricing } from '@/lib/pricing';
import { getSiteSettings } from '@/lib/data/settings';
import type { CartItem, CartItem as CartItemType } from '@/types';
import type { ICart } from '@/models/Cart';
import type { CartAddIn } from '@/types';
import { cartItemInputSchema } from '@/lib/validators';

type CartDocument = ICart & {
  items: Types.DocumentArray<
    CartItem & {
      _id: Types.ObjectId;
      deleteOne: () => void;
    }
  >;
};

export async function getOrCreateCart(sessionId: string, customerId?: string): Promise<CartDocument> {
  await connectDB();

  if (customerId) {
    let cart = await Cart.findOne({ customerId: new Types.ObjectId(customerId) });
    if (!cart) {
      cart = await Cart.create({ customerId: new Types.ObjectId(customerId), items: [] });
    }
    return cart as unknown as CartDocument;
  }

  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({
      sessionId,
      items: [],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }
  return cart as unknown as CartDocument;
}

async function buildCartItem(input: ReturnType<typeof cartItemInputSchema.parse>): Promise<CartItemType | null> {
  const product = await Product.findById(input.productId);
  if (!product || product.status !== 'published') return null;

  let unitPrice = product.basePrice;
  let variantName;
  let variantSku = input.variantSku;

  if (input.variantSku) {
    const sku = input.variantSku.toUpperCase();
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant && variant.price > 0) {
      unitPrice = variant.price;
      variantName = variant.name;
      variantSku = variant.sku;
    }
  }

  let kitConfig;
  if (input.kitSizeKey) {
    const kitSize = product.kitSizes.find((k) => k.key === input.kitSizeKey);
    if (kitSize) {
      unitPrice = kitSize.price;
      kitConfig = {
        kitSizeKey: kitSize.key,
        kitSizeName: kitSize.name,
        servings: kitSize.servings,
        unitPrice: kitSize.price,
      };
    }
  }

  const flavorIds = input.flavorIds?.map((id) => new Types.ObjectId(id)) ?? [];
  const flavorDocs = flavorIds.length
    ? await Flavor.find({ _id: { $in: flavorIds } }).lean()
    : [];

  const addIns = [];
  if (input.addIns?.length) {
    for (const a of input.addIns) {
      const addIn = await AddIn.findById(a.addInId);
      if (addIn) {
        addIns.push({
          addInId: addIn._id as Types.ObjectId,
          name: addIn.name,
          quantity: a.quantity,
          unitPrice: addIn.price,
        });
      }
    }
  }

  const addInLineTotal = addIns.reduce((s, a) => s + a.unitPrice * a.quantity, 0);
  const lineTotal = (unitPrice + addInLineTotal) * input.quantity;

  if (unitPrice <= 0) return null;

  return {
    productId: product._id as Types.ObjectId,
    productName: product.name,
    productSlug: product.slug,
    sku: product.sku,
    variantSku,
    variantName,
    flavorIds,
    flavorNames: flavorDocs.map((f) => f.name),
    addIns,
    kitConfig,
    quantity: input.quantity,
    unitPrice,
    lineTotal,
    notes: input.notes,
  };
}

export async function addCartItem(sessionId: string, payload: unknown, customerId?: string) {
  const parsed = cartItemInputSchema.parse(payload);
  await connectDB();
  const item = await buildCartItem(parsed);
  if (!item) throw new Error('Product not found');

  const cart = await getOrCreateCart(sessionId, customerId);
  cart.items.push(item as CartItem);
  await cart.save();
  return cart;
}

export async function updateCartItemQuantity(
  sessionId: string,
  itemId: string,
  quantity: number,
  customerId?: string
) {
  await connectDB();
  const cart = await getOrCreateCart(sessionId, customerId);
  const item = cart.items.id(itemId);
  if (!item) throw new Error('Item not found');
  if (quantity <= 0) {
    item.deleteOne();
  } else {
    item.quantity = quantity;
    const addInTotal =
      item.addIns?.reduce((sum: number, addIn: CartAddIn) => sum + addIn.unitPrice * addIn.quantity, 0) ?? 0;
    item.lineTotal = (item.unitPrice + addInTotal) * item.quantity;
  }
  await cart.save();
  return cart;
}

export async function removeCartItem(sessionId: string, itemId: string, customerId?: string) {
  await connectDB();
  const cart = await getOrCreateCart(sessionId, customerId);
  const item = cart.items.id(itemId);
  if (!item) throw new Error('Item not found');
  item.deleteOne();
  await cart.save();
  return cart;
}

export async function getCartWithTotals(sessionId: string, customerId?: string) {
  const cart = await getOrCreateCart(sessionId, customerId);
  const settings = await getSiteSettings();
  const pricing = await calculateOrderPricing({
    items: cart.items as CartItem[],
    fulfillmentMethod: 'pickup',
    shippingFlatRate: settings.shipping?.flatRate ?? 0,
    freeShippingThreshold: settings.shipping?.freeShippingThreshold,
    currency: settings.currency ?? 'USD',
  });

  return { cart, totals: pricing.totals };
}
