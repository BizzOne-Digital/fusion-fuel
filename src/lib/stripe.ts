import Stripe from 'stripe';
import type { OrderTotals } from '@/types';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2026-07-29.dahlia',
      typescript: true,
    });
  }

  return stripeClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

export interface CreateCheckoutSessionInput {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  locale: string;
  lineItems: {
    name: string;
    amount: number;
    quantity: number;
  }[];
  totals: OrderTotals;
  successPath: string;
  cancelPath: string;
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: input.customerEmail,
    line_items: input.lineItems.map((item) => ({
      price_data: {
        currency: input.totals.currency.toLowerCase(),
        product_data: {
          name: item.name,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    })),
    success_url: `${siteUrl}${input.successPath}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}${input.cancelPath}`,
    metadata: {
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      locale: input.locale,
    },
    payment_intent_data: {
      metadata: {
        orderId: input.orderId,
        orderNumber: input.orderNumber,
      },
    },
  });

  return session;
}

export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string | null
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  if (!signature) {
    throw new Error('Missing Stripe signature header');
  }

  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export function formatAmountFromMinorUnits(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}
