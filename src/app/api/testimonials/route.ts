import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { reviewSubmitSchema } from '@/lib/validators/testimonial';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const parsed = reviewSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, role, quote, rating } = parsed.data;
    const roleText = role?.trim();

    await connectDB();
    await Testimonial.create({
      name,
      role: roleText ? { en: roleText, es: roleText } : undefined,
      quote: { en: quote, es: quote },
      rating,
      verified: false,
      status: 'draft',
      order: 999,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
