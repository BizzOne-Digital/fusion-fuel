import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { bookingSchema } from '@/lib/validators';
import { BOOKING_REFERENCE_PREFIX } from '@/lib/constants';
import {
  buildBookingBusinessEmail,
  buildBookingCustomerEmail,
  getContactToEmail,
  sendEmail,
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.website) {
      return NextResponse.json({ success: true, referenceNumber: 'SPAM' });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    await connectDB();
    const service = await Service.findOne({ slug: parsed.data.serviceSlug, status: 'published' });
    const session = await auth();

    const referenceNumber = `${BOOKING_REFERENCE_PREFIX}-${Date.now().toString(36).toUpperCase()}`;
    const venueAddress = `${parsed.data.street}, ${parsed.data.city}, ${parsed.data.state} ${parsed.data.zip}`;

    const booking = await Booking.create({
      referenceNumber,
      customerId: session?.user?.role === 'customer' ? session.user.id : undefined,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.email,
      contactPhone: parsed.data.phone,
      companyName: parsed.data.organization,
      eventType: parsed.data.eventType,
      eventDate: parsed.data.preferredDate,
      eventStartTime: parsed.data.startTime,
      guestCount: parsed.data.guestCount,
      venueName: parsed.data.venueName ?? (parsed.data.fulfillmentMethod === 'pickup' ? 'Pickup' : 'Event venue'),
      venueAddress: parsed.data.street,
      venueCity: parsed.data.city,
      venueState: parsed.data.state,
      venueZip: parsed.data.zip,
      serviceType: service?.name.en ?? parsed.data.serviceSlug,
      menuPreferences: parsed.data.productInterests.join(', '),
      dietaryRestrictions: parsed.data.dietaryNotes ? [parsed.data.dietaryNotes] : [],
      specialRequests: [
        parsed.data.specialInstructions,
        parsed.data.alternateDate ? `Alternate date: ${parsed.data.alternateDate}` : '',
        parsed.data.budgetRange ? `Budget: ${parsed.data.budgetRange}` : '',
        `Preferred contact: ${parsed.data.preferredContactMethod}`,
        `Fulfillment: ${parsed.data.fulfillmentMethod}`,
      ]
        .filter(Boolean)
        .join('\n'),
      estimatedBudget: undefined,
      status: 'pending',
    });

    const payload = {
      referenceNumber,
      contactName: parsed.data.contactName,
      email: parsed.data.email,
      serviceName: service?.name.en ?? parsed.data.serviceSlug,
      eventType: parsed.data.eventType,
      preferredDate: parsed.data.preferredDate.toISOString().split('T')[0],
      guestCount: parsed.data.guestCount,
    };

    const customerEmail = buildBookingCustomerEmail(payload);
    const businessEmail = buildBookingBusinessEmail({
      ...payload,
      details: booking.specialRequests ?? '',
      phone: parsed.data.phone,
      organization: parsed.data.organization,
      venue: venueAddress,
      alternateDate: parsed.data.alternateDate
        ? parsed.data.alternateDate.toISOString().split('T')[0]
        : undefined,
      startTime: parsed.data.startTime,
      fulfillmentMethod: parsed.data.fulfillmentMethod,
      preferredContactMethod: parsed.data.preferredContactMethod,
    });

    await sendEmail({ to: parsed.data.email, ...customerEmail });
    await sendEmail({ to: getContactToEmail(), ...businessEmail, replyTo: parsed.data.email });

    return NextResponse.json({ success: true, referenceNumber, id: booking._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Booking submission failed' }, { status: 500 });
  }
}
