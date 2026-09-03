/** Protein treats menu — truffles and mini donuts pack pricing. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const PROTEIN_TREATS_MENU = {
  headline: 'Protein Treats',
  proteinTruffles: {
    slug: 'protein-truffles',
    name: 'Protein Truffles',
    description: 'Bite-size protein truffles — add to your order.',
    image: {
      url: '/images/protein-treats/protein-truffles.png',
      alt: 'Protein truffles in paper cups on a white plate',
    },
    pack: { count: 2, price: 3 },
  },
  proteinMiniDonuts: {
    slug: 'protein-mini-donuts',
    name: 'Protein Mini Donuts',
    description: 'Soft protein mini donuts — add to your order.',
    image: {
      url: '/images/donut.png',
      alt: 'Protein mini donuts with glaze',
    },
    pack: { count: 4, price: 5 },
  },
  items: [
    {
      kind: 'protein-truffles' as const,
      slug: 'protein-truffles',
      name: 'Protein Truffles',
      description: 'Bite-size protein truffles — add to your order.',
    },
    {
      kind: 'protein-mini-donuts' as const,
      slug: 'protein-mini-donuts',
      name: 'Protein Mini Donuts',
      description: 'Soft protein mini donuts — add to your order.',
    },
  ],
} as const;

export type ProteinTreatMenuItem = (typeof PROTEIN_TREATS_MENU.items)[number];

export function isProteinTreatProduct(slug: string): boolean {
  return PROTEIN_TREATS_MENU.items.some((item) => item.slug === slug);
}

function treatPackConfig(item: ProteinTreatMenuItem) {
  if (item.kind === 'protein-truffles') {
    return PROTEIN_TREATS_MENU.proteinTruffles.pack;
  }
  return PROTEIN_TREATS_MENU.proteinMiniDonuts.pack;
}

function treatImageConfig(item: ProteinTreatMenuItem) {
  if (item.kind === 'protein-truffles') {
    return PROTEIN_TREATS_MENU.proteinTruffles.image;
  }
  return PROTEIN_TREATS_MENU.proteinMiniDonuts.image;
}

export function proteinTreatDescriptionHtml(item: ProteinTreatMenuItem): string {
  const pack = treatPackConfig(item);

  return [
    `<p><strong>${item.name}</strong> — ${PROTEIN_TREATS_MENU.headline}.</p>`,
    `<p>${item.description}</p>`,
    `<p><strong>Price:</strong> ${pack.count} for ${formatUsd(pack.price)}</p>`,
  ].join('');
}

export function proteinTreatItemPriceCents(item: ProteinTreatMenuItem): number {
  return Math.round(treatPackConfig(item).price * 100);
}

export function proteinTreatItemVariants(
  item: ProteinTreatMenuItem,
  sku: string
): Array<{ sku: string; name: { en: string; es: string }; price: number; inventory: number }> {
  const pack = treatPackConfig(item);
  const price = Math.round(pack.price * 100);

  return [
    {
      sku: `${sku}-${pack.count}PK`,
      name: { en: `${pack.count} pack`, es: `${pack.count} pack` },
      price,
      inventory: 0,
    },
  ];
}

export function proteinTreatShortDescription(item: ProteinTreatMenuItem): string {
  const pack = treatPackConfig(item);
  return `${item.description} ${pack.count} for ${formatUsd(pack.price)}.`;
}

export function proteinTreatPricingSummary(): string {
  const { proteinTruffles, proteinMiniDonuts } = PROTEIN_TREATS_MENU;
  return [
    `${proteinTruffles.name}: ${proteinTruffles.pack.count} for ${formatUsd(proteinTruffles.pack.price)}`,
    `${proteinMiniDonuts.name}: ${proteinMiniDonuts.pack.count} for ${formatUsd(proteinMiniDonuts.pack.price)}`,
  ].join(' · ');
}

export function proteinTreatItemImage(item: ProteinTreatMenuItem): { url: string; alt: string } {
  return treatImageConfig(item);
}
