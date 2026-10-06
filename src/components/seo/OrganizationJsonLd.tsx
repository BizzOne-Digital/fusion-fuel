import { BRAND, BUSINESS_DEFAULTS, DEFAULT_BUSINESS_HOURS } from '@/lib/constants';
import { absoluteUrl, localePath } from '@/lib/seo';
import { SITE_IMAGES } from '@/lib/site-images';

function openingHoursSpecification() {
  return DEFAULT_BUSINESS_HOURS.map((entry) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: entry.day.charAt(0).toUpperCase() + entry.day.slice(1),
    opens: entry.open,
    closes: entry.close,
  }));
}

export function OrganizationJsonLd({
  settings,
}: {
  settings?: {
    contactPhone?: string;
    contactEmail?: string;
    address?: { street?: string; city?: string; state?: string; zip?: string; country?: string };
  };
}) {
  const address = settings?.address ?? BUSINESS_DEFAULTS.address;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    '@id': `${absoluteUrl(localePath('en'))}#organization`,
    name: BRAND.name,
    url: absoluteUrl(localePath('en')),
    image: absoluteUrl(SITE_IMAGES.heroDrinks),
    email: settings?.contactEmail ?? BUSINESS_DEFAULTS.email,
    telephone: settings?.contactPhone ?? BUSINESS_DEFAULTS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    },
    servesCuisine: 'Loaded Teas, Protein Beverages, Açaí Bowls',
    priceRange: '$$',
    openingHoursSpecification: openingHoursSpecification(),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
