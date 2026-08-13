import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import {
  buildOrderBusinessEmail,
  buildOrderCustomerEmail,
  getContactToEmail,
  sendEmail,
} from '@/lib/email';
import { dispatchCRMEvent } from '@/lib/crm';
import { incrementPromotionUsage } from '@/lib/promotions';
import { formatAmountFromMinorUnits, verifyStripeWebhook } from '@/lib/stripe';
import { summarizeLineItemsForEmail } from '@/lib/pricing';

const processedEventIds = new Set<string>();

async function adjustInventory(orderId: string): Promise<void> {
  const order = await Order.findById(orderId);
  if (!order) {
    return;
  }

  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.productId, trackInventory: true },
      { $inc: { inventory: -item.quantity } }
    );
  }
}

async function markOrderPaid(
  orderId: string,
  session: Stripe.Checkout.Session
): Promise<boolean> {
  const order = await Order.findById(orderId);
  if (!order) {
    return false;
  }

  if (order.paymentStatus === 'paid') {
    return false;
  }

  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.stripeCheckoutSessionId = session.id;
  order.stripePaymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

  order.statusHistory.push({
    status: 'confirmed',
    note: 'Payment confirmed via Stripe webhook',
    changedAt: new Date(),
  });

  await order.save();

  if (order.promotionId) {
    await incrementPromotionUsage(order.promotionId.toString());
  }

  await adjustInventory(order._id.toString());

  const locale = (session.metadata?.locale as 'en' | 'es' | undefined) ?? 'en';
  const customerEmail = order.guestEmail ?? session.customer_email ?? '';
  const customerName = order.guestName ?? 'Customer';
  const itemsSummary = summarizeLineItemsForEmail(order.items, locale);
  const totalFormatted = formatAmountFromMinorUnits(order.totals.total, order.totals.currency);

  if (customerEmail) {
    const customerTemplate = buildOrderCustomerEmail({
      orderNumber: order.orderNumber,
      customerName,
      email: customerEmail,
      totalFormatted,
      itemsSummary,
    });

    await sendEmail({
      to: customerEmail,
      subject: customerTemplate.subject,
      text: customerTemplate.text,
      html: customerTemplate.html,
    });
  }

  const businessTemplate = buildOrderBusinessEmail({
    orderNumber: order.orderNumber,
    customerName,
    email: customerEmail,
    totalFormatted,
    itemsSummary,
  });

  await sendEmail({
    to: getContactToEmail(),
    subject: businessTemplate.subject,
    text: businessTemplate.text,
    html: businessTemplate.html,
    replyTo: customerEmail || undefined,
  });

  await dispatchCRMEvent('order.paid', {
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
    total: order.totals.total,
    currency: order.totals.currency,
    customerEmail,
  });

  return true;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    throw new Error('Missing orderId in checkout session metadata');
  }

  await connectDB();
  await markOrderPaid(orderId, session);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) {
    return;
  }

  await connectDB();

  const order = await Order.findById(orderId);
  if (!order || order.paymentStatus === 'paid') {
    return;
  }

  order.paymentStatus = 'failed';
  order.status = 'cancelled';
  order.stripePaymentIntentId = paymentIntent.id;
  order.statusHistory.push({
    status: 'cancelled',
    note: 'Payment failed',
    changedAt: new Date(),
  });

  await order.save();
}

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get('stripe-signature');
  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = verifyStripeWebhook(payload, signature);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (processedEventIds.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          await handleCheckoutCompleted(session);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      default:
        break;
    }

    processedEventIds.add(event.id);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
