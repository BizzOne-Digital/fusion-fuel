import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';
import { contactSchema } from '@/lib/validators';
import {
  buildContactBusinessEmail,
  buildContactCustomerEmail,
  getContactToEmail,
  sendEmail,
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    await ContactSubmission.create({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      subject: parsed.data.subject,
      message: parsed.data.message,
      locale: body.locale ?? 'en',
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    });

    const customerEmail = buildContactCustomerEmail(parsed.data);
    const businessEmail = buildContactBusinessEmail(parsed.data);

    await sendEmail({ to: parsed.data.email, ...customerEmail });
    await sendEmail({ to: getContactToEmail(), ...businessEmail, replyTo: parsed.data.email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
