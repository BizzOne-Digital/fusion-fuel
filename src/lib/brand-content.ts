/** Marketing copy sourced from the Monthly Tea Club poster (image is not used on-site). */

import { MENU_FLAVORS } from '@/lib/menu-flavors';

export const CONTACT = {
  phone: '+1 813-842-2594',
  email: 'fusionfuelboostco@gmail.com',
  instagramHandle: '@fusionfuelboost2025',
  instagramUrl: 'https://www.instagram.com/fusionfuelboost2025/',
  instagramQrImage: '/brand/instagram-qr.png',
  facebookUrl: 'https://www.facebook.com/share/1SyawX94pF/',
  facebookLabel: 'Fusion Fuel & Boost Co.',
} as const;

export const MONTHLY_TEA_CLUB = {
  name: 'Monthly Mega Tea Club',
  intro: 'Monthly Mega Tea Club',
  posterImage: '/brand/monthly-mega-tea-club-poster.jpg',
  boxTagline: 'Mega Tea Kits In. Good Vibes Out.',
  taglines: {
    primary: 'New flavors delivered to your door.',
    secondary: 'Sip More. Love More.',
    value: 'A surprise every month.',
    product: 'Surprise yourself with curated monthly tea kits.',
  },
  surpriseNote:
    'Pick how many kits you want each month — flavors are a monthly surprise, delivered locally or shipped nationwide.',
  cta: 'Join the Club',
  ctaDetail: 'Text or DM us to subscribe, or complete the sign-up form below.',
  joinHeadline: 'JOIN THE CLUB',
  plans: [
    { kits: 6, label: '6 Kits', slug: '6-kits' },
    { kits: 12, label: '12 Kits', slug: '12-kits' },
    { kits: 20, label: '20 Kits', slug: '20-kits' },
    { kits: 30, label: '30 Kits', slug: '30-kits' },
  ],
  fulfillmentOptions: [
    {
      slug: 'local-delivery',
      label: 'Local Delivery',
      description: 'Delivered within 3 miles ($25 minimum order).',
    },
    {
      slug: 'nationwide-shipping',
      label: 'Nationwide Shipping',
      description: 'Shipped anywhere in the U.S.',
    },
  ],
  features: [
    {
      title: 'New Flavors Every Month',
      description:
        'Every box features surprise loaded tea blends you have not tried before — curated fresh each month.',
    },
    {
      title: 'Easy Step-by-Step Guide',
      description: 'Each kit includes simple instructions so you can mix perfect teas at home.',
    },
    {
      title: 'Customizable Add-Ons',
      description: 'Enhance your kits with wellness boosters and add-ins when you sign up.',
    },
    {
      title: 'A Surprise Every Month',
      description:
        'You choose how many kits — we surprise you with new flavors, delivered or shipped to your door.',
    },
  ],
  whatsInside: [
    'Surprise Loaded Tea Kits',
    'Easy Step-by-Step Guide',
    'Wellness Boosters & Add-Ins',
    'New Flavors Every Month',
    'Delivered or Shipped Monthly',
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
    { label: 'Build Your Kit', href: '/menu?category=mega-tea-kits', icon: 'kit' as const },
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
    'Flavor Enhancer',
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

export function monthlyTeaClubServiceHtml(): string {
  const c = MONTHLY_TEA_CLUB;
  return [
    `<p><strong>${c.intro}</strong></p>`,
    `<p>${c.taglines.primary}</p>`,
    `<p><em>${c.taglines.secondary}</em></p>`,
    `<p>${c.boxTagline}</p>`,
    `<h3>What's Inside</h3>`,
    `<ul>${c.whatsInside.map((item) => `<li>${item}</li>`).join('')}</ul>`,
    `<p>${c.surpriseNote}</p>`,
    `<h3>Choose Your Box</h3>`,
    `<ul>${c.plans.map((plan) => `<li>${plan.label}</li>`).join('')}</ul>`,
    `<h3>Why Join</h3>`,
    `<ul>${c.features.map((feature) => `<li><strong>${feature.title}</strong> — ${feature.description}</li>`).join('')}</ul>`,
    `<p><strong>${c.joinHeadline}</strong> ${c.ctaDetail}</p>`,
    `<p>${DELIVERY.local} ${DELIVERY.nationwide}</p>`,
    `<p>Phone: ${CONTACT.phone} · Email: ${CONTACT.email} · Instagram: ${CONTACT.instagramHandle}</p>`,
  ].join('');
}

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
