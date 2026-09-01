/** Mega Tea Kits — single kit inclusions and pricing. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const MEGA_TEA_KIT_PRODUCT_SLUG = 'mega-tea-kit-builder';

export const MEGA_TEA_KITS_MENU = {
  headline: 'Mega Tea Kits',
  slug: MEGA_TEA_KIT_PRODUCT_SLUG,
  name: 'Mega Tea Kit',
  description: 'Make loaded teas at home with premium boosters and your choice of flavor enhancer.',
  price: 12,
  heroImage: {
    url: '/images/mega-tea-kits/hero.jpg',
    alt: 'Mega Tea Kit with colorful flavor pouches and an iced loaded tea',
  },
  includes: [
    'Lift Off',
    'Aloe Vera',
    'NRG or Tea',
    'Collagen',
    'Flavor Enhancer',
  ] as const,
  flavorPickerLimit: 1,
} as const;

export function megaTeaKitPriceCents(): number {
  return Math.round(MEGA_TEA_KITS_MENU.price * 100);
}

export function megaTeaKitPricingSummary(): string {
  return `${formatUsd(MEGA_TEA_KITS_MENU.price)} each`;
}

export function megaTeaKitIncludesSummary(): string {
  return MEGA_TEA_KITS_MENU.includes.join(', ');
}

export function megaTeaKitDescriptionHtml(): string {
  const includesList = MEGA_TEA_KITS_MENU.includes
    .map((item) => `<li>${item}</li>`)
    .join('');

  return [
    `<p><strong>${MEGA_TEA_KITS_MENU.name}</strong> — ${MEGA_TEA_KITS_MENU.headline}.</p>`,
    `<p>${MEGA_TEA_KITS_MENU.description}</p>`,
    `<p><strong>Price:</strong> ${formatUsd(MEGA_TEA_KITS_MENU.price)}</p>`,
    `<p><strong>Each kit includes:</strong></p>`,
    `<ul>${includesList}</ul>`,
    `<p>Choose your flavor enhancer on this page — the preview image updates when you select a flavor.</p>`,
  ].join('');
}

export function isMegaTeaKitProduct(slug: string): boolean {
  return slug === MEGA_TEA_KIT_PRODUCT_SLUG;
}

export function megaTeaKitFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function megaTeaKitShortDescription(): string {
  return `${MEGA_TEA_KITS_MENU.description} Includes ${megaTeaKitIncludesSummary()}. ${formatUsd(MEGA_TEA_KITS_MENU.price)}.`;
}
