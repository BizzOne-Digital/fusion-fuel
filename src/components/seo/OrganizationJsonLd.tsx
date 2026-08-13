import { BRAND, BUSINESS_DEFAULTS } from '@/lib/constants';

export function OrganizationJsonLd({ settings }: { settings?: { contactPhone?: string; contactEmail?: string } }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    url: `https://${BRAND.domain}`,
    email: settings?.contactEmail ?? BUSINESS_DEFAULTS.email,
    telephone: settings?.contactPhone ?? BUSINESS_DEFAULTS.phone,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
