/** Marketing copy sourced from the Monthly Tea Club poster (image is not used on-site). */

import { MENU_FLAVORS } from '@/lib/menu-flavors';

export const CONTACT = {
  phone: '+1 813-842-2594',
  email: 'fusionfuelboostco@gmail.com',
  instagramHandle: '@fusionfuelandboostco',
  instagramUrl: 'https://www.instagram.com/fusionfuelandboostco',
} as const;

export const MONTHLY_TEA_CLUB = {
  name: 'Monthly Tea Club',
  intro: 'Introducing our Monthly Tea Club',
  posterImage: '/brand/monthly-tea-club-poster.png',
  boxTagline: 'Your Monthly Boost of Flavor, Energy & Good Vibes!',
  taglines: {
    primary: 'New Flavors. Good Energy. Delivered.',
    secondary: 'Sip More. Love More. Feel Amazing!',
    value: 'More Tea. More Value. More Happiness!',
    product: 'Real Ingredients. Real Results. Made For You.',
  },
  cta: 'Join the Club',
  ctaDetail: 'Text or DM us to subscribe or learn more!',
  joinHeadline: 'JOIN THE CLUB!',
  plans: [
    { servings: 6, label: '6 Tea Kit Box' },
    { servings: 12, label: '12 Tea Kit Box' },
    { servings: 20, label: '20 Tea Kit Box' },
    { servings: 30, label: '30 Tea Kit Box' },
  ],
  features: [
    {
      title: 'Surprise Every Month',
      description:
        'A curated box of loaded tea blends, exclusive recipes, and seasonal favorites delivered to your door.',
    },
    {
      title: 'Premium Ingredients',
      description:
        'Made with high-quality ingredients to fuel your day and support your wellness.',
    },
    {
      title: 'New Flavors Monthly',
      description: "Discover exciting new blends you won't find anywhere else.",
    },
    {
      title: 'Made Just For You',
      description:
        'Everything you need to create delicious, refreshing, and energizing teas at home.',
    },
  ],
  whatsInside: [
    '5+ Loaded Tea Blends',
    'Easy Step-by-Step Guide',
    'Wellness Boosters & Add-Ins',
    'Sweet Extras & Surprises',
    'New Flavors Every Month',
  ],
} as const;

export const DELIVERY = {
  local: 'Local delivery available within 3 miles (minimum order $25).',
  nationwide: 'Nationwide shipping available.',
} as const;

export const HOME_HERO = {
  eyebrow: 'Made to Order • Flavorful • Customizable',
  description:
    'Loaded Teas, protein-forward favorites, açaí bowls and more—crafted to complement your active lifestyle.',
  ctaPrimary: 'Shop Mega Tea Kits',
  ctaSecondary: 'Explore the Menu',
  ctaTertiary: 'Book Catering',
  features: [
    { label: '100+ Flavor Combinations', href: '/menu?category=mega-teas', icon: 'cup' as const },
    { label: 'Build Your Kit', href: '/products/mega-tea-kit-builder', icon: 'kit' as const },
    { label: 'Catering for Every Occasion', href: '/booking', icon: 'catering' as const },
  ],
} as const;

export const CATERING_TAGLINE =
  'Catering available — perfect for events, parties, offices, and special occasions.';

/** Loaded tea menu from the flavor poster (photos added separately by the client). */
export const LOADED_TEAS = {
  headline: 'Loaded Teas Made For You!',
  combinations: '100+ Combinations! Create your perfect blend.',
  sellingPoints: [
    'Real ingredients. Real energy.',
    'Boost your day naturally.',
    'Delicious flavors. Endless possibilities.',
  ],
  addOns: [
    'Collagen — Unflavored',
    'Collagen — Strawberry Lemonade',
    'Extra B12',
    'Extra Hydration',
    'Watermelon Hydrate',
    'NRG (Regular)',
    'NRG (Flavor)',
    'Extra Tea — Lemon',
    'Extra Tea — Raspberry',
    'Extra Tea — Chai',
    'Extra Tea — Sweet Ginger',
    'Aloe — Mango',
    'Aloe — Mandarin',
    'Aloe — Unflavored',
    'Aloe — Grape',
    'CR7',
  ],
  flavors: MENU_FLAVORS.map((flavor) => ({
    slug: flavor.slug,
    name: flavor.name,
    category: flavor.collection,
    color: flavor.color,
    isNew: flavor.isNew,
    ingredients: flavor.ingredients,
  })),
} as const;

export function flavorIngredientsHtml(ingredients: readonly string[]): string {
  return `<p><strong>Ingredients:</strong></p><ul>${ingredients.map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

export const BRAND_MOTTO = 'Fuel • Boost • Thrive';

/** Açaí Bowl Event Experience — client-provided catering package details. */
export const ACAI_BOWL_EVENT = {
  name: 'Açaí Bowl Event Experience',
  headline: 'Elevate your next event with our fresh, vibrant Fusion Fuel & Boost Açaí Bowl Bar.',
  guestPackages: [50, 75, 100, 125, 150, 200, 300] as const,
  bowlSizes: ['5 oz Mini Bowl', '9 oz Bowl', '12 oz Bowl'] as const,
  venueTypes: ['Indoor', 'Outdoor'] as const,
  serviceArea: 'Serving events throughout Hillsborough & Manatee Counties',
  deliveryNote: 'Delivery included within 20 miles',
  serviceDuration: 'Up to 2 hours of on-site service',
  deposit: 'A 50% deposit is required to secure your event date.',
  balance: 'The remaining 50% balance is due prior to the start of service on the day of the event.',
  perfectFor: [
    'Corporate Events',
    'Schools',
    'Gyms',
    'Weddings',
    'Baby Showers',
    'Birthdays',
    'Wellness Events',
    'Community Events',
    'Private Parties',
  ],
  freshFruits: ['Strawberries', 'Bananas', 'Kiwi', 'Blueberries'],
  premiumToppings: [
    'Granola',
    'Peanut Butter',
    'Nutella',
    'Chocolate Chips',
    'Sliced Almonds',
    'Coconut Flakes',
    'Condensed Milk',
    'Caramel Drizzle',
  ],
  packageIncludes: [
    'Açaí bowls pre-portioned and prepared for efficient service',
    'Fresh fruit selection',
    'Premium topping selection',
    'Professional event setup and serving station',
    'Bowls finished fresh on-site with each guest’s choice of fruits and toppings',
    'Up to 2 hours of service',
    'Delivery included within 20 miles',
  ],
  howItWorks: [
    'We arrive with bowls pre-portioned to ensure a smooth and efficient service experience.',
    'Guests select their preferred fresh fruits and toppings, and each bowl is finished on-site at our serving station.',
    'If all bowls are served before the 2-hour service window ends, service will conclude at that time.',
    'Any remaining bowls at the end of the event will be prepared for you to enjoy afterward.',
  ],
} as const;

export function acaiBowlEventServiceHtml(): string {
  const e = ACAI_BOWL_EVENT;
  return [
    `<p><strong>${e.headline}</strong></p>`,
    `<h3>Choose Your Package</h3>`,
    `<p>Available for ${e.guestPackages.join(' | ')} guests.</p>`,
    `<h3>Choose Your Bowl Size</h3>`,
    `<ul>${e.bowlSizes.map((size) => `<li>${size}</li>`).join('')}</ul>`,
    `<h3>Your Package Includes</h3>`,
    `<ul>${e.packageIncludes.map((item) => `<li>${item}</li>`).join('')}</ul>`,
    `<h3>Fresh Fruit Selection</h3>`,
    `<ul>${e.freshFruits.map((item) => `<li>${item}</li>`).join('')}</ul>`,
    `<h3>Premium Topping Selection</h3>`,
    `<ul>${e.premiumToppings.map((item) => `<li>${item}</li>`).join('')}</ul>`,
    `<p><strong>Your event can be:</strong> ${e.venueTypes.join(' or ')}.</p>`,
    `<h3>How It Works</h3>`,
    `<ul>${e.howItWorks.map((item) => `<li>${item}</li>`).join('')}</ul>`,
    `<h3>Reservations & Payment</h3>`,
    `<ul><li>${e.deposit}</li><li>${e.balance}</li></ul>`,
    `<p><strong>${e.serviceArea}</strong></p>`,
    `<p>Perfect for: ${e.perfectFor.join(' • ')}</p>`,
  ].join('');
}
