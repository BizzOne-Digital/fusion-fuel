import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { checkoutSchema } from '@/lib/validators';
import { getCartWithTotals } from '@/lib/cart/service';
import { getCartSessionId } from '@/lib/cart/session';
import { getSiteSettings } from '@/lib/data/settings';
import { calculateOrderPricing } from '@/lib/pricing';
import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe';
import { ORDER_NUMBER_PREFIX } from '@/lib/constants';
import { hasPrice } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.local.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const session = await auth();
    const sessionId = await getCartSessionId();
    const { cart } = await getCartWithTotals(
      sessionId,
      session?.user?.role === 'customer' ? session.user.id : undefined
    );

    if (cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const settings = await getSiteSettings();
    const pricing = await calculateOrderPricing({
      items: cart.items,
      fulfillmentMethod: parsed.data.fulfillmentMethod,
      promotionCode: parsed.data.promotionCode,
      customerId: session?.user?.role === 'customer' ? session.user.id : undefined,
      shippingFlatRate: settings.shipping?.flatRate ?? 0,
      freeShippingThreshold: settings.shipping?.freeShippingThreshold,
      currency: settings.currency ?? 'USD',
    });

    if (pricing.totals.total <= 0 || pricing.items.some((item) => !hasPrice(item.lineTotal))) {
      return NextResponse.json(
        { error: 'Some items require pricing confirmation. Please contact us before checkout.' },
        { status: 400 }
      );
    }

    await connectDB();
    const orderNumber = `${ORDER_NUMBER_PREFIX}-${Date.now().toString(36).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      customerId: session?.user?.role === 'customer' ? new Types.ObjectId(session.user.id) : undefined,
      guestEmail: parsed.data.email,
      items: pricing.items,
      totals: pricing.totals,
      fulfillmentMethod: parsed.data.fulfillmentMethod,
      shippingAddress: parsed.data.shippingAddress,
      pickupDetails:
        parsed.data.fulfillmentMethod === 'pickup'
          ? {
              locationName: parsed.data.pickupLocationName ?? 'Pickup',
              address: parsed.data.pickupLocationName ?? 'See order confirmation',
            }
          : undefined,
      promotionCode: parsed.data.promotionCode,
      discountAmount: pricing.totals.discount,
      customerNotes: parsed.data.customerNotes,
      paymentStatus: 'pending',
      status: 'pending',
      statusHistory: [{ status: 'pending', changedAt: new Date() }],
    });

    const locale = body.locale ?? 'en';
    const stripeSession = await createCheckoutSession({
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      customerEmail: parsed.data.email,
      locale,
      lineItems: pricing.items.map((item) => ({
        name: item.productName.en,
        amount: item.lineTotal,
        quantity: 1,
      })),
      totals: pricing.totals,
      successPath: `/${locale}/checkout/success`,
      cancelPath: `/${locale}/checkout`,
    });

    await Order.updateOne(
      { _id: order._id },
      { $set: { stripeCheckoutSessionId: stripeSession.id } }
    );

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
