import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import PasswordResetToken from '@/models/PasswordResetToken';
import { resetPasswordSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest('hex');
    await connectDB();

    const resetToken = await PasswordResetToken.findOne({
      tokenHash,
      userType: 'customer',
      usedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    }).select('+tokenHash');

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await Customer.updateOne({ _id: resetToken.userId }, { $set: { passwordHash } });
    await PasswordResetToken.updateOne({ _id: resetToken._id }, { $set: { usedAt: new Date() } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
