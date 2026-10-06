import { auth } from '@/lib/auth';
import { redirect, Link } from '@/i18n/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export default async function BookingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== 'customer') {
    redirect({ href: '/account/login', locale: locale as 'en' | 'es' });
  }

  const customer = user!;

  await connectDB();
  const bookings = await Booking.find({ customerId: customer.id }).sort({ createdAt: -1 }).lean();
  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-5xl">{t('bookingHistory')}</h1>
      <div className="mt-8 space-y-4">
        {bookings.map((b) => (
          <div key={String(b._id)} className="rounded-2xl border border-grey/15 p-4">
            <p className="font-semibold">{b.referenceNumber}</p>
            <p className="text-sm text-grey">{b.serviceType} · {b.status}</p>
            <p className="text-sm">{new Date(b.eventDate).toLocaleDateString()}</p>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-grey">No bookings yet.</p>}
      </div>
      <Link href="/booking" className="mt-6 inline-block text-pink hover:underline">Submit a new request</Link>
    </div>
  );
}
