/** Protein treats menu — truffles, mini donuts, and pie in a cup. */

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
      { slug: '9oz', name: '9 oz', price: 4.99, variantSuffix: '9OZ' },
      { slug: '16oz', name: '16 oz', price: 8.99, variantSuffix: '16OZ' },
    ] as const,
    flavors: [
      { slug: 'oreo', name: 'Oreo', image: '/images/pie-in-a-cup/oreo.png' },
      { slug: 'snickers', name: 'Snickers' },
      { slug: 'reeses-cup', name: "Reese's Cup" },
      { slug: 'smores', name: "S'mores", image: '/images/pie-in-a-cup/smores.png' },
      { slug: 'snickerdoodle', name: 'Snickerdoodle', image: '/images/pie-in-a-cup/snickerdoodle.png' },
      { slug: 'banana-pudding', name: 'Banana Pudding' },
      {
        slug: 'strawberry-cheesecake',
        name: 'Strawberry Cheesecake',
        image: '/images/pie-in-a-cup/strawberry-cheesecake.png',
      },
    ],
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
    {
      kind: 'pie-in-a-cup' as const,
      slug: 'pie-in-a-cup',
      name: 'Pie in a Cup',
      description: 'Creamy protein treat — pick your flavor.',
    },
  ],
} as const;

export type ProteinTreatMenuItem = (typeof PROTEIN_TREATS_MENU.items)[number];
export type PieInACupFlavor = (typeof PROTEIN_TREATS_MENU.pieInACup.flavors)[number];

export function isProteinTreatProduct(slug: string): boolean {
  return PROTEIN_TREATS_MENU.items.some((item) => item.slug === slug);
}

/** Protein treats that never show optional add-ons on the product page. */
export function productExcludesOptionalAddOns(slug: string): boolean {
  return (
    slug === PROTEIN_TREATS_MENU.proteinTruffles.slug ||
    slug === PROTEIN_TREATS_MENU.pieInACup.slug
  );
}

export function isPieInACupProduct(slug: string): boolean {
  return slug === PROTEIN_TREATS_MENU.pieInACup.slug;
}

export function pieInACupFlavorNote(flavorName: string): string {
  return `Flavor: ${flavorName}`;
}

export function pieInACupFlavorImage(flavor: PieInACupFlavor): { url: string; alt: string } {
  if ('image' in flavor && flavor.image) {
    return { url: flavor.image, alt: flavor.name };
  }
  return PROTEIN_TREATS_MENU.pieInACup.image;
}

export function pieInACupSizePriceCents(sizeSlug: string): number {
  const size = PROTEIN_TREATS_MENU.pieInACup.sizes.find((entry) => entry.slug === sizeSlug);
  return size ? Math.round(size.price * 100) : 0;
}

export function pieInACupVariantSku(sizeSlug: string, productSku: string): string {
  const size = PROTEIN_TREATS_MENU.pieInACup.sizes.find((entry) => entry.slug === sizeSlug);
  return size ? `${productSku}-${size.variantSuffix}` : '';
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
  if (item.kind === 'protein-mini-donuts') {
    return PROTEIN_TREATS_MENU.proteinMiniDonuts.image;
  }
  return PROTEIN_TREATS_MENU.pieInACup.image;
}

export function proteinTreatDescriptionHtml(item: ProteinTreatMenuItem): string {
  if (item.kind === 'pie-in-a-cup') {
    const { pieInACup } = PROTEIN_TREATS_MENU;
    const sizeLines = pieInACup.sizes
      .map((size) => `<li><strong>${size.name}</strong> — ${formatUsd(size.price)}</li>`)
      .join('');
    const flavorLines = pieInACup.flavors.map((flavor) => `<li>${flavor.name}</li>`).join('');

    return [
      `<p><strong>${item.name}</strong> — ${PROTEIN_TREATS_MENU.headline}.</p>`,
      `<p>${item.description}</p>`,
      `<p><strong>Sizes:</strong></p><ul>${sizeLines}</ul>`,
      `<p><strong>Flavors:</strong></p><ul>${flavorLines}</ul>`,
      `<p>Choose your flavor on this page — the preview image updates when you select a flavor.</p>`,
    ].join('');
  }

  const pack = treatPackConfig(item);

  return [
    `<p><strong>${item.name}</strong> — ${PROTEIN_TREATS_MENU.headline}.</p>`,
    `<p>${item.description}</p>`,
    `<p><strong>Price:</strong> ${pack.count} for ${formatUsd(pack.price)}</p>`,
  ].join('');
}

export function proteinTreatItemPriceCents(item: ProteinTreatMenuItem): number {
  if (item.kind === 'pie-in-a-cup') {
    return pieInACupSizePriceCents('9oz');
  }
  return Math.round(treatPackConfig(item).price * 100);
}

export function proteinTreatItemVariants(
  item: ProteinTreatMenuItem,
  sku: string
): Array<{ sku: string; name: { en: string; es: string }; price: number; inventory: number }> {
  if (item.kind === 'pie-in-a-cup') {
    return PROTEIN_TREATS_MENU.pieInACup.sizes.map((size) => ({
      sku: `${sku}-${size.variantSuffix}`,
      name: { en: size.name, es: size.name },
      price: pieInACupSizePriceCents(size.slug),
      inventory: 0,
    }));
  }

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
  if (item.kind === 'pie-in-a-cup') {
    const sizeSummary = PROTEIN_TREATS_MENU.pieInACup.sizes
      .map((size) => `${size.name} ${formatUsd(size.price)}`)
      .join(' · ');
    return `${item.description} ${sizeSummary}.`;
  }

  const pack = treatPackConfig(item);
  return `${item.description} ${pack.count} for ${formatUsd(pack.price)}.`;
}

export function proteinTreatPricingSummary(): string {
  const { proteinTruffles, proteinMiniDonuts, pieInACup } = PROTEIN_TREATS_MENU;
  const pieLine = pieInACup.sizes
    .map((size) => `${size.name} ${formatUsd(size.price)}`)
    .join(' · ');

  return [
    `${proteinTruffles.name}: ${proteinTruffles.pack.count} for ${formatUsd(proteinTruffles.pack.price)}`,
    `${proteinMiniDonuts.name}: ${proteinMiniDonuts.pack.count} for ${formatUsd(proteinMiniDonuts.pack.price)}`,
    `${pieInACup.name}: ${pieLine}`,
  ].join(' · ');
}

export function proteinTreatItemImage(item: ProteinTreatMenuItem): { url: string; alt: string } {
  return treatImageConfig(item);
}

export function proteinTreatPieImages(): Array<{ url: string; alt: string }> {
  const { image, hoverImage } = PROTEIN_TREATS_MENU.pieInACup;
  return [
    { url: image.url, alt: image.alt },
    { url: hoverImage.url, alt: hoverImage.alt },
  ];
}
