import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getServiceBySlug, getPublishedServices } from '@/lib/data';
import { getLocalized, sanitizeHtml, formatPrice, hasPrice } from '@/lib/utils';
import { getServiceImage } from '@/lib/site-images';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/types';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const related = (await getPublishedServices()).filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <article className="min-w-0 overflow-x-clip">
      <div className="relative min-h-[40vh] w-full overflow-x-clip bg-ink text-white">
        <Image src={service.heroImage?.url?.includes('/placeholders/') ? getServiceImage(slug) : (service.heroImage?.url ?? getServiceImage(slug))} alt="" fill className="object-cover opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-6">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: getLocalized(service.name, locale as Locale) }]} />
          <h1 className="font-display max-w-full break-words text-4xl sm:text-5xl">{getLocalized(service.name, locale as Locale)}</h1>
          <p className="mt-4 max-w-2xl text-white/80">{getLocalized(service.shortDescription, locale as Locale)}</p>
        </div>
      </div>
      <div className="page-shell mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="prose-brand max-w-none text-grey" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(service.detailContent, locale as Locale)) }} />
        {service.sections.map((section, index) => (
          <section key={`${service.slug}-section-${index}`} className="mt-12 grid gap-8 lg:grid-cols-2">
            {section.image && (
              <Image
                src={section.image.url}
                alt={section.image.alt}
                width={600}
                height={400}
                className="h-auto w-full max-w-full rounded-2xl"
              />
            )}
            <div>
              <h2 className="font-display text-3xl">{getLocalized(section.title, locale as Locale)}</h2>
              <div className="mt-4 text-grey" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(section.body, locale as Locale)) }} />
            </div>
          </section>
        ))}
        {service.faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display mb-6 text-3xl">FAQs</h2>
            <Accordion items={service.faqs.sort((a, b) => a.order - b.order).map((f, index) => ({
              id: `${service.slug}-faq-${index}`,
              title: getLocalized(f.question, locale as Locale),
              content: <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(f.answer, locale as Locale)) }} />,
            }))} />
          </div>
        )}
        <div className="mt-16 rounded-2xl bg-cream p-8 text-center">
          <p className="font-display text-3xl">Ready to plan your event?</p>
          <p className="mt-2 text-grey">{hasPrice(service.startingPrice) ? `Starting at ${formatPrice(service.startingPrice, 'USD', locale as Locale)}` : 'Request a personalized quote'}</p>
          <Link href="/booking" className="mt-6 inline-block"><Button>Submit Catering Request</Button></Link>
        </div>
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-3xl">Related Services</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((s) => (
                <Link key={String(s._id)} href={`/services/${s.slug}`} className="rounded-xl border border-grey/15 p-4 hover:bg-cream">
                  {getLocalized(s.name, locale as Locale)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
