import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import PasswordResetToken from '@/models/PasswordResetToken';
import { forgotPasswordSchema } from '@/lib/validators';
import { buildPasswordResetEmail, sendEmail } from '@/lib/email';
import { PASSWORD_RESET_EXPIRY_HOURS } from '@/lib/constants';
import { rateLimit, buildRateLimitKey, PASSWORD_RESET_RATE_LIMIT } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const limit = rateLimit(buildRateLimitKey('forgot-password', ip), PASSWORD_RESET_RATE_LIMIT);
    if (!limit.success) {
      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: true });
    }

    await connectDB();
    const customer = await Customer.findOne({ email: parsed.data.email });
    if (!customer) {
      return NextResponse.json({ success: true });
    }

    const token = nanoid(48);
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await PasswordResetToken.create({
      userId: customer._id,
      userType: 'customer',
      tokenHash,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const resetUrl = `${siteUrl}/en/account/reset-password?token=${token}`;
    const email = buildPasswordResetEmail({
      name: customer.name,
      resetUrl,
      expiresInHours: PASSWORD_RESET_EXPIRY_HOURS,
    });

    await sendEmail({ to: customer.email, ...email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: true });
  }
}

function nanoid(size: number): string {
  return crypto.randomBytes(size).toString('hex').slice(0, size);
}
