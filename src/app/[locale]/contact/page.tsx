import { setRequestLocale } from 'next-intl/server';
import { getSiteSettings } from '@/lib/data';
import { ContactForm } from '@/components/forms/ContactForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <h1 className="font-display text-5xl">Contact</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-grey">Reach out for catering inquiries, product questions, or pricing information.</p>
          <dl className="mt-8 space-y-4">
            <div><dt className="text-sm text-grey">Email</dt><dd className="font-semibold">{settings.contactEmail}</dd></div>
            <div><dt className="text-sm text-grey">Phone</dt><dd className="font-semibold">{settings.contactPhone}</dd></div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
