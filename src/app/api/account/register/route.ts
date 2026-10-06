import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { registerSchema } from '@/lib/validators';
import { rateLimit, buildRateLimitKey, LOGIN_RATE_LIMIT } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    const limit = rateLimit(buildRateLimitKey('register', ip), LOGIN_RATE_LIMIT);
    if (!limit.success) {
      return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const existing = await Customer.findOne({ email: parsed.data.email });
    if (existing) {
      return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await Customer.create({
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name,
      phone: parsed.data.phone,
      emailVerified: false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
