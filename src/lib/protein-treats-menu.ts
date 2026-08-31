/** Protein treats menu — Pie in a Cup, truffles, flavors, and add-on pricing. */

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export const PROTEIN_TREATS_MENU = {
  headline: 'Protein Treats',
  addOnPricing: {
    standard: 3,
    wellness: 2,
  },
  standardAddOns: ['Watermelon Hydrate'] as const,
  wellnessAddOns: ['Immunity', 'Probiotics'] as const,
  pieInACup: {
    slug: 'pie-in-a-cup',
    name: 'Pie in a Cup',
    description: 'Creamy protein treat — pick your flavor.',
    image: {
      url: '/images/pie-in-a-cup/oreo.png',
      alt: 'Pie in a Cup — Oreo flavor with cookie crumbles',
    },
    hoverImage: {
      url: '/images/pie-in-a-cup/snickerdoodle.png',
      alt: 'Pie in a Cup — Snickerdoodle with cinnamon crumb topping',
    },
    sizes: [
      { slug: '9oz', name: '9 oz', price: 4.99 },
      { slug: '16oz', name: '16 oz', price: 8.99 },
    ] as const,
    flavors: [
      'Oreo',
      'Snickers',
      "Reese's Cup",
      "S'mores",
      'Snickerdoodle',
      'Banana Pudding',
      'Strawberry Cheesecake',
    ] as const,
  },
  proteinTruffles: {
    slug: 'protein-truffles',
    name: 'Protein Truffles',
    description: 'Bite-size protein truffles.',
    image: {
      url: '/images/protein-treats/protein-truffles.png',
      alt: 'Protein truffles — bite-size treats in paper cups on a white plate',
    },
    pack: { count: 2, price: 3 },
  },
  items: [
    {
      kind: 'pie-in-a-cup' as const,
      slug: 'pie-in-a-cup',
      name: 'Pie in a Cup',
      description: 'Creamy protein treat — pick your flavor.',
    },
    {
      kind: 'protein-truffles' as const,
      slug: 'protein-truffles',
      name: 'Protein Truffles',
      description: 'Bite-size protein truffles.',
    },
  ],
} as const;

export type ProteinTreatMenuItem = (typeof PROTEIN_TREATS_MENU.items)[number];

export function proteinTreatDescriptionHtml(item: ProteinTreatMenuItem): string {
  const { addOnPricing, standardAddOns, wellnessAddOns, pieInACup, proteinTruffles } = PROTEIN_TREATS_MENU;

  if (item.kind === 'protein-truffles') {
    return [
      `<p><strong>${item.name}</strong> — ${PROTEIN_TREATS_MENU.headline}.</p>`,
      `<p>${item.description}</p>`,
      `<p><strong>Price:</strong> ${proteinTruffles.pack.count} for ${formatUsd(proteinTruffles.pack.price)}</p>`,
    ].join('');
  }

  const sizeLines = pieInACup.sizes
    .map((size) => `<li><strong>${size.name}</strong> — ${formatUsd(size.price)}</li>`)
    .join('');

  return [
    `<p><strong>${item.name}</strong> — ${PROTEIN_TREATS_MENU.headline}.</p>`,
    `<p>${item.description}</p>`,
    `<p><strong>Sizes:</strong></p><ul>${sizeLines}</ul>`,
    `<p><strong>Flavors:</strong> ${pieInACup.flavors.join(', ')}.</p>`,
    `<p><strong>Add-ons:</strong> ${formatUsd(addOnPricing.standard)} each — flavor add-ons${standardAddOns.length ? `, ${standardAddOns.join(', ')}` : ''}.</p>`,
    `<p><strong>Wellness add-ons:</strong> ${wellnessAddOns.join(' & ')} — ${formatUsd(addOnPricing.wellness)} each.</p>`,
  ].join('');
}

export function proteinTreatItemPriceCents(item: ProteinTreatMenuItem): number {
  if (item.kind === 'protein-truffles') {
    return Math.round(PROTEIN_TREATS_MENU.proteinTruffles.pack.price * 100);
  }

  return proteinTreatSizePriceCents('9oz');
}

export function proteinTreatItemVariants(
  item: ProteinTreatMenuItem,
  sku: string
): Array<{ sku: string; name: { en: string; es: string }; price: number; inventory: number }> {
  if (item.kind === 'protein-truffles') {
    const { pack } = PROTEIN_TREATS_MENU.proteinTruffles;
    const price = Math.round(pack.price * 100);
    return [
      {
        sku: `${sku}-2PK`,
        name: { en: `${pack.count} pack`, es: `${pack.count} pack` },
        price,
        inventory: 0,
      },
    ];
  }

  return PROTEIN_TREATS_MENU.pieInACup.sizes.map((size) => ({
    sku: `${sku}-${size.slug.toUpperCase()}`,
    name: { en: size.name, es: size.name },
    price: proteinTreatSizePriceCents(size.slug),
    inventory: 0,
  }));
}

export function proteinTreatShortDescription(item: ProteinTreatMenuItem): string {
  if (item.kind === 'protein-truffles') {
    const { pack } = PROTEIN_TREATS_MENU.proteinTruffles;
    return `${item.description} ${pack.count} for $${pack.price.toFixed(2)}.`;
  }

  const sizeSummary = PROTEIN_TREATS_MENU.pieInACup.sizes
    .map((size) => `${size.name} $${size.price.toFixed(2)}`)
    .join(' · ');
  return `${item.description} ${sizeSummary}.`;
}

export function proteinTreatPricingSummary(): string {
  const { pieInACup, proteinTruffles } = PROTEIN_TREATS_MENU;
  const pieLine = pieInACup.sizes
    .map((size) => `${size.name} $${size.price.toFixed(2)}`)
    .join(' · ');

  return `${pieInACup.name}: ${pieLine} · ${proteinTruffles.name}: ${proteinTruffles.pack.count} for $${proteinTruffles.pack.price.toFixed(2)}`;
}

export function proteinTreatSizePriceCents(sizeSlug: string): number {
  const size = PROTEIN_TREATS_MENU.pieInACup.sizes.find((entry) => entry.slug === sizeSlug);
  return size ? Math.round(size.price * 100) : 0;
}
