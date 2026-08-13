import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { BRAND, BUSINESS_DEFAULTS } from '@/lib/constants';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host) {
    throw new Error('SMTP_HOST is not configured');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  return transporter;
}

function getFromAddress(): string {
  const name = process.env.SMTP_FROM_NAME ?? BRAND.name;
  const email = process.env.SMTP_FROM_EMAIL ?? BUSINESS_DEFAULTS.email;
  return `"${name}" <${email}>`;
}

function wrapHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${BRAND.name}</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #10161A; background: #FFFDF8; margin: 0; padding: 24px;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
      <p style="margin-top: 0; font-weight: 700; color: #10161A;">${BRAND.name}</p>
      ${content}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="font-size: 12px; color: #687078; margin-bottom: 0;">
        ${BRAND.name} · ${BUSINESS_DEFAULTS.email}
      </p>
    </div>
  </body>
</html>`;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const mailer = getTransporter();

  await mailer.sendMail({
    from: getFromAddress(),
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  });
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  preferredContactMethod: 'email' | 'phone';
}

export function buildContactCustomerEmail(payload: ContactEmailPayload) {
  const subject = `We received your message — ${BRAND.name}`;
  const text = `Hi ${payload.name},

Thank you for contacting ${BRAND.name}. We received your message and will respond soon.

Subject: ${payload.subject}
Message:
${payload.message}

— ${BRAND.name}`;

  const html = wrapHtml(`
    <p>Hi ${payload.name},</p>
    <p>Thank you for contacting ${BRAND.name}. We received your message and will respond soon.</p>
    <p><strong>Subject:</strong> ${payload.subject}</p>
    <p><strong>Your message:</strong></p>
    <p style="white-space: pre-wrap;">${payload.message}</p>
  `);

  return { subject, text, html };
}

export function buildContactBusinessEmail(payload: ContactEmailPayload) {
  const subject = `[Contact] ${payload.subject}`;
  const text = `New contact submission

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone ?? 'N/A'}
Preferred contact: ${payload.preferredContactMethod}

Subject: ${payload.subject}

Message:
${payload.message}`;

  const html = wrapHtml(`
    <h2 style="margin-top: 0;">New contact submission</h2>
    <p><strong>Name:</strong> ${payload.name}<br />
    <strong>Email:</strong> ${payload.email}<br />
    <strong>Phone:</strong> ${payload.phone ?? 'N/A'}<br />
    <strong>Preferred contact:</strong> ${payload.preferredContactMethod}</p>
    <p><strong>Subject:</strong> ${payload.subject}</p>
    <p style="white-space: pre-wrap;">${payload.message}</p>
  `);

  return { subject, text, html };
}

export interface BookingEmailPayload {
  referenceNumber: string;
  contactName: string;
  email: string;
  serviceName: string;
  eventType: string;
  preferredDate: string;
  guestCount: number;
}

export function buildBookingCustomerEmail(payload: BookingEmailPayload) {
  const subject = `Catering request received — ${payload.referenceNumber}`;
  const text = `Hi ${payload.contactName},

Thank you for your catering request with ${BRAND.name}.

Reference: ${payload.referenceNumber}
Service: ${payload.serviceName}
Event type: ${payload.eventType}
Preferred date: ${payload.preferredDate}
Guest count: ${payload.guestCount}

This is a request, not a confirmed booking. Our team will follow up soon.

— ${BRAND.name}`;

  const html = wrapHtml(`
    <p>Hi ${payload.contactName},</p>
    <p>Thank you for your catering request with ${BRAND.name}.</p>
    <ul>
      <li><strong>Reference:</strong> ${payload.referenceNumber}</li>
      <li><strong>Service:</strong> ${payload.serviceName}</li>
      <li><strong>Event type:</strong> ${payload.eventType}</li>
      <li><strong>Preferred date:</strong> ${payload.preferredDate}</li>
      <li><strong>Guest count:</strong> ${payload.guestCount}</li>
    </ul>
    <p><em>This is a request, not a confirmed booking. Our team will follow up soon.</em></p>
  `);

  return { subject, text, html };
}

export function buildBookingBusinessEmail(payload: BookingEmailPayload & { details: string }) {
  const subject = `[Booking] ${payload.referenceNumber} — ${payload.serviceName}`;
  const text = `New catering request ${payload.referenceNumber}

Contact: ${payload.contactName} (${payload.email})
Service: ${payload.serviceName}
Event type: ${payload.eventType}
Preferred date: ${payload.preferredDate}
Guest count: ${payload.guestCount}

${payload.details}`;

  const html = wrapHtml(`
    <h2 style="margin-top: 0;">New catering request</h2>
    <p><strong>Reference:</strong> ${payload.referenceNumber}</p>
    <p><strong>Contact:</strong> ${payload.contactName} (${payload.email})</p>
    <p><strong>Service:</strong> ${payload.serviceName}</p>
    <p style="white-space: pre-wrap;">${payload.details}</p>
  `);

  return { subject, text, html };
}

export interface OrderEmailPayload {
  orderNumber: string;
  customerName: string;
  email: string;
  totalFormatted: string;
  itemsSummary: string;
}

export function buildOrderCustomerEmail(payload: OrderEmailPayload) {
  const subject = `Order confirmed — ${payload.orderNumber}`;
  const text = `Hi ${payload.customerName},

Thank you for your order with ${BRAND.name}.

Order: ${payload.orderNumber}
Total: ${payload.totalFormatted}

Items:
${payload.itemsSummary}

— ${BRAND.name}`;

  const html = wrapHtml(`
    <p>Hi ${payload.customerName},</p>
    <p>Thank you for your order with ${BRAND.name}.</p>
    <p><strong>Order:</strong> ${payload.orderNumber}<br />
    <strong>Total:</strong> ${payload.totalFormatted}</p>
    <pre style="white-space: pre-wrap; font-family: inherit;">${payload.itemsSummary}</pre>
  `);

  return { subject, text, html };
}

export function buildOrderBusinessEmail(payload: OrderEmailPayload) {
  const subject = `[Order] ${payload.orderNumber} — ${payload.totalFormatted}`;
  const text = `New paid order ${payload.orderNumber}

Customer: ${payload.customerName} (${payload.email})
Total: ${payload.totalFormatted}

Items:
${payload.itemsSummary}`;

  const html = wrapHtml(`
    <h2 style="margin-top: 0;">New paid order</h2>
    <p><strong>Order:</strong> ${payload.orderNumber}<br />
    <strong>Customer:</strong> ${payload.customerName} (${payload.email})<br />
    <strong>Total:</strong> ${payload.totalFormatted}</p>
    <pre style="white-space: pre-wrap; font-family: inherit;">${payload.itemsSummary}</pre>
  `);

  return { subject, text, html };
}

export interface PasswordResetEmailPayload {
  name: string;
  resetUrl: string;
  expiresInHours: number;
}

export function buildPasswordResetEmail(payload: PasswordResetEmailPayload) {
  const subject = `Reset your ${BRAND.name} password`;
  const text = `Hi ${payload.name},

We received a request to reset your password. Use the link below within ${payload.expiresInHours} hours:

${payload.resetUrl}

If you did not request this, you can ignore this email.

— ${BRAND.name}`;

  const html = wrapHtml(`
    <p>Hi ${payload.name},</p>
    <p>We received a request to reset your password. Click the link below within ${payload.expiresInHours} hours:</p>
    <p><a href="${payload.resetUrl}" style="color: #FF3F72;">Reset your password</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `);

  return { subject, text, html };
}

export interface VerificationEmailPayload {
  name: string;
  verifyUrl: string;
  expiresInHours: number;
}

export function buildVerificationEmail(payload: VerificationEmailPayload) {
  const subject = `Verify your ${BRAND.name} email`;
  const text = `Hi ${payload.name},

Please verify your email address within ${payload.expiresInHours} hours:

${payload.verifyUrl}

— ${BRAND.name}`;

  const html = wrapHtml(`
    <p>Hi ${payload.name},</p>
    <p>Please verify your email address within ${payload.expiresInHours} hours:</p>
    <p><a href="${payload.verifyUrl}" style="color: #FF3F72;">Verify email address</a></p>
  `);

  return { subject, text, html };
}

export function getContactToEmail(): string {
  return process.env.CONTACT_TO_EMAIL ?? BUSINESS_DEFAULTS.email;
}
