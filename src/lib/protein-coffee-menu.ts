/** Protein coffee menu from client poster — iced/hot sizes and flavor list. */

export const PROTEIN_COFFEE = {
  headline: 'Protein Coffee',
  servingNote: 'Iced/Hot — 24 oz & 32 oz iced, 10 oz hot',
  footerNotes: [
    'Add fat-reducing creamer to any coffee',
    'Ask for flavor available',
  ],
  flavors: [
    { slug: 'house-blend', name: 'House Blend' },
    { slug: 'hazelnut', name: 'Hazelnut' },
    { slug: 'salted-caramel', name: 'Salted Caramel' },
    { slug: 'french-vanilla', name: 'French Vanilla' },
    { slug: 'white-chocolate', name: 'White Chocolate' },
    { slug: 'brown-sugar-cinnamon', name: 'Brown Sugar Cinnamon' },
    { slug: 'caramel-macchiato', name: 'Caramel Macchiato' },
    { slug: 'mocha', name: 'Mocha' },
  ],
} as const;

export type ProteinCoffeeFlavor = (typeof PROTEIN_COFFEE.flavors)[number];
