import './load-env';

import bcrypt from 'bcryptjs';
import mongoose, { Types } from 'mongoose';
import {
  BRAND,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_CURRENCY,
  SITE_SETTINGS_KEY,
  SUPPORTED_LOCALES,
} from '../src/lib/constants';
import AdminUser from '../src/models/AdminUser';
import AddIn from '../src/models/AddIn';
import FAQ from '../src/models/FAQ';
import Flavor from '../src/models/Flavor';
import Page from '../src/models/Page';
import Product from '../src/models/Product';
import ProductCategory from '../src/models/ProductCategory';
import Promotion from '../src/models/Promotion';
import Service from '../src/models/Service';
import SiteSettings from '../src/models/SiteSettings';
import { SITE_IMAGES, getCategoryImage, getServiceImage, getProductFallbackImage, getFlavorImage } from '../src/lib/site-images';
import { CATERING_TAGLINE, CONTACT, DELIVERY, acaiBowlEventServiceHtml, ACAI_BOWL_EVENT, flavorIngredientsHtml, HOME_HERO, LOADED_TEAS, MONTHLY_TEA_CLUB } from '../src/lib/brand-content';

const ES = '[ES - Review Required]';

function loc(en: string) {
  return { en, es: ES };
}

function rich(en: string) {
  return { en, es: ES };
}

function img(url: string, alt: string) {
  return { url, alt, width: 1200, height: 800 };
}

async function connect(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required. Set it in .env.local');
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
}

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('Skipping admin seed: ADMIN_EMAIL and ADMIN_PASSWORD must be set.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await AdminUser.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        passwordHash,
        name: 'Fusion Fuel Admin',
        role: 'super_admin',
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin user upserted: ${email}`);
}

async function seedSiteSettings(): Promise<void> {
  await SiteSettings.findOneAndUpdate(
    { key: SITE_SETTINGS_KEY },
    {
      $set: {
        key: SITE_SETTINGS_KEY,
        businessName: BRAND.name,
        tagline: {
          en: 'FUEL YOUR DAY. BOOST YOUR LIFE.',
          es: ES,
        },
        contactEmail: CONTACT.email,
        contactPhone: CONTACT.phone,
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: 'US',
        },
        timezone: 'America/Chicago',
        seo: {
          title: `${BRAND.name} | Premium Fuel for Body and Mind`,
          description:
            'Monthly Tea Club, Mega Teas, protein coffee, shakes, waffles, donuts, and full-service catering. Local delivery and nationwide shipping.',
          keywords: [
            'monthly tea club',
            'mega tea',
            'protein shakes',
            'acai bowls',
            'catering',
            'fusion fuel boost',
          ],
          ogImage: img(SITE_IMAGES.hero, 'Fusion Fuel & Boost Co.'),
        },
        announcement: {
          enabled: true,
          message: loc('Mega Tea Kits • 100+ Flavor Combinations'),
          link: '/en/products/mega-tea-kit-builder',
          backgroundColor: '#E8F000',
          textColor: '#07090A',
        },
        shipping: {
          enabled: false,
          flatRate: 0,
          freeShippingThreshold: 0,
          estimatedDaysMin: 0,
          estimatedDaysMax: 0,
          zones: [],
        },
        pickup: {
          enabled: false,
          locations: [],
        },
        currency: DEFAULT_CURRENCY,
        locales: [...SUPPORTED_LOCALES],
        defaultLocale: 'en',
        footer: {
          tagline: loc('Premium fuel for body and mind.'),
          columns: [
            {
              title: loc('Shop'),
              links: [
                { label: loc('Products'), href: '/en/products' },
                { label: loc('Monthly Tea Club'), href: '/en/products/mega-tea-kit-builder' },
                { label: loc('Pricing'), href: '/en/pricing' },
              ],
            },
            {
              title: loc('Company'),
              links: [
                { label: loc('About'), href: '/en/about' },
                { label: loc('Services'), href: '/en/services' },
                { label: loc('Contact'), href: '/en/contact' },
              ],
            },
          ],
        },
        social: [
          {
            platform: 'instagram',
            url: CONTACT.instagramUrl,
            label: CONTACT.instagramHandle,
          },
        ],
        hours: [...DEFAULT_BUSINESS_HOURS],
        legalLinks: [
          { label: loc('Privacy Policy'), href: '/en/privacy' },
          { label: loc('Terms of Service'), href: '/en/terms' },
        ],
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Site settings upserted.');
}

function buildPages() {
  const ctaShop = {
    label: loc(MONTHLY_TEA_CLUB.cta),
    href: '/en/products/mega-tea-kit-builder',
    variant: 'primary' as const,
  };

  const ctaCatering = {
    label: loc('Book Catering'),
    href: '/en/booking',
    variant: 'secondary' as const,
  };

  return [
    {
      pageKey: 'home',
      title: loc('Home'),
      status: 'published' as const,
      seo: {
        title: `${BRAND.name} | FUEL YOUR DAY. BOOST YOUR LIFE.`,
        description:
          'Monthly Tea Club, Mega Teas, protein-forward menu items, and full-service catering.',
      },
      hero: {
        title: loc('FUEL YOUR DAY. BOOST YOUR LIFE.'),
        subtitle: loc(HOME_HERO.description),
        backgroundImage: img(SITE_IMAGES.heroDrinks, 'Fusion Fuel Mega Tea hero'),
        cta: ctaShop,
      },
      sections: [
        {
          key: 'intro',
          type: 'text' as const,
          title: loc('Welcome to Fusion Fuel & Boost Co.'),
          body: rich(
            '<p>Fusion Fuel & Boost Co. offers a diverse selection of flavorful products designed to complement an active lifestyle. From made-to-order Mega Teas to protein-forward treats and customizable kits, every item is built around bold taste and everyday convenience.</p>'
          ),
          order: 0,
          theme: 'light' as const,
        },
        {
          key: 'mega-tea-showcase',
          type: 'image_text' as const,
          title: loc('Mega Tea Energy'),
          body: rich(
            '<p>Discover vibrant Mega Tea flavors with customizable add-ins. Ingredient and nutrition details are available for each product once confirmed by the business.</p>'
          ),
          images: [img(SITE_IMAGES.megaTea, 'Mega Tea cups')],
          order: 1,
          theme: 'dark' as const,
        },
        {
          key: 'kit-club',
          type: 'cta' as const,
          title: loc(MONTHLY_TEA_CLUB.name),
          body: rich(
            `<p><strong>${MONTHLY_TEA_CLUB.intro}</strong></p><p>${MONTHLY_TEA_CLUB.taglines.primary}</p><p>${MONTHLY_TEA_CLUB.taglines.product}</p><ul>${MONTHLY_TEA_CLUB.whatsInside.map((item) => `<li>${item}</li>`).join('')}</ul><p>${DELIVERY.local} ${DELIVERY.nationwide}</p><p>${MONTHLY_TEA_CLUB.ctaDetail}</p>`
          ),
          cta: {
            label: loc(MONTHLY_TEA_CLUB.cta),
            href: '/en/products/mega-tea-kit-builder',
            variant: 'primary' as const,
          },
          order: 2,
          theme: 'accent' as const,
        },
        {
          key: 'catering',
          type: 'features' as const,
          title: loc('Catering & Events'),
          body: rich(
            `<p>${CATERING_TAGLINE} We also cater corporate offices, medical practices, schools, weddings, and private parties. ${DELIVERY.local}</p>`
          ),
          cta: ctaCatering,
          order: 3,
          theme: 'gradient' as const,
        },
      ],
    },
    {
      pageKey: 'about',
      title: loc('About Us'),
      status: 'published' as const,
      hero: {
        title: loc('Our Story'),
        subtitle: loc('Bold flavor. Everyday fuel. Built for people on the move.'),
        backgroundImage: img(SITE_IMAGES.aboutTeam, 'About Fusion Fuel'),
      },
      sections: [
        {
          key: 'mission',
          type: 'text' as const,
          title: loc('Mission'),
          body: rich(
            '<p>Fusion Fuel & Boost Co. provides energizing, flavorful products for customers who want convenient options throughout the day. We focus on customization, quality ingredients, and memorable experiences—without making unverified health claims.</p>'
          ),
          order: 0,
        },
        {
          key: 'values',
          type: 'features' as const,
          title: loc('What We Stand For'),
          body: rich(
            '<ul><li>Made-to-order freshness</li><li>Flavorful, customizable menu items</li><li>Transparent ingredient information when provided</li><li>Professional catering for teams and events</li></ul>'
          ),
          images: [img(SITE_IMAGES.aboutTeam, 'Brand values')],
          order: 1,
          theme: 'dark' as const,
        },
      ],
    },
    {
      pageKey: 'services',
      title: loc('Services'),
      status: 'published' as const,
      hero: {
        title: loc('Catering & Programs'),
        subtitle: loc('From office refreshment to celebration spreads.'),
        backgroundImage: img(SITE_IMAGES.catering, 'Catering services'),
        cta: ctaCatering,
      },
      sections: [
        {
          key: 'overview',
          type: 'text' as const,
          title: loc('Full-Service Catering'),
          body: rich(
            `<p>${CATERING_TAGLINE} Packages, minimums, and pricing are confirmed after your inquiry.</p><p>${DELIVERY.local} ${DELIVERY.nationwide}</p>`
          ),
          order: 0,
        },
      ],
    },
    {
      pageKey: 'pricing',
      title: loc('Pricing'),
      status: 'published' as const,
      hero: {
        title: loc('Pricing & Packages'),
        subtitle: loc('Contact us for current pricing. Menu prices are configured by the administrator.'),
        backgroundImage: img(SITE_IMAGES.pricing, 'Pricing overview'),
      },
      sections: [
        {
          key: 'pricing-note',
          type: 'text' as const,
          title: loc('Contact for Pricing'),
          body: rich(
            `<p>Choose a Monthly Tea Club plan: 6, 12, 20, or 30 tea kit boxes. ${MONTHLY_TEA_CLUB.taglines.value}</p><p>${DELIVERY.local} ${DELIVERY.nationwide}</p><p>Product and catering prices are managed in the admin portal and published when confirmed.</p>`
          ),
          order: 0,
        },
      ],
    },
    {
      pageKey: 'products',
      title: loc('Products'),
      status: 'published' as const,
      hero: {
        title: loc('Shop the Menu'),
        subtitle: loc('Mega Teas, bowls, coffee, shakes, waffles, donuts, treats, and seasonal items.'),
        backgroundImage: img(SITE_IMAGES.productsHero, 'Product menu'),
        cta: ctaShop,
      },
      sections: [
        {
          key: 'products-intro',
          type: 'text' as const,
          title: loc('Browse by Category'),
          body: rich(
            '<p>Products marked as draft or without a listed price require administrator confirmation before checkout. Caffeine and allergen details appear when provided by the business.</p>'
          ),
          order: 0,
        },
      ],
    },
    {
      pageKey: 'booking',
      title: loc('Book Catering'),
      status: 'published' as const,
      hero: {
        title: loc('Request Catering'),
        subtitle: loc('Submit your event details. Confirmation will follow after review.'),
        backgroundImage: img(SITE_IMAGES.booking, 'Book catering'),
        cta: ctaCatering,
      },
      sections: [
        {
          key: 'booking-process',
          type: 'text' as const,
          title: loc('How Booking Works'),
          body: rich(
            '<ol><li>Tell us about your event type, date, and guest count.</li><li>Share venue details and product interests.</li><li>Receive an acknowledgement by email.</li><li>A team member confirms availability and next steps.</li></ol>'
          ),
          order: 0,
        },
      ],
    },
    {
      pageKey: 'testimonials',
      title: loc('Testimonials'),
      status: 'published' as const,
      hero: {
        title: loc('Customer Stories'),
        subtitle: loc('Verified testimonials are added by the administrator after client approval.'),
        backgroundImage: img(SITE_IMAGES.testimonials, 'Testimonials'),
      },
      sections: [
        {
          key: 'testimonials-note',
          type: 'text' as const,
          title: loc('Share Your Experience'),
          body: rich(
            '<p>We do not display placeholder reviews. Submit verified testimonials through the admin portal once collected from real customers.</p>'
          ),
          order: 0,
        },
      ],
    },
    {
      pageKey: 'faqs',
      title: loc('FAQs'),
      status: 'published' as const,
      hero: {
        title: loc('Questions & Answers'),
        subtitle: loc('Helpful information about our menu, kits, catering, and orders.'),
        backgroundImage: img(SITE_IMAGES.faq, 'FAQs'),
      },
      sections: [
        {
          key: 'faq-intro',
          type: 'text' as const,
          title: loc('Need Help?'),
          body: rich(
            '<p>Find answers below or contact us for personalized support. We avoid unverified medical or guaranteed-outcome claims.</p>'
          ),
          order: 0,
        },
      ],
    },
    {
      pageKey: 'contact',
      title: loc('Contact'),
      status: 'published' as const,
      hero: {
        title: loc('Get in Touch'),
        subtitle: loc(`Email ${CONTACT.email} or call ${CONTACT.phone}. Text or DM us on Instagram to join the Monthly Tea Club.`),
        backgroundImage: img(SITE_IMAGES.contact, 'Contact Fusion Fuel'),
      },
      sections: [
        {
          key: 'contact-details',
          type: 'text' as const,
          title: loc('Contact Information'),
          body: rich(
            `<p><strong>Email:</strong> ${CONTACT.email}<br/><strong>Phone:</strong> ${CONTACT.phone}<br/><strong>Instagram:</strong> ${CONTACT.instagramHandle}</p><p>${MONTHLY_TEA_CLUB.ctaDetail}</p><p>${DELIVERY.local} ${DELIVERY.nationwide}</p>`
          ),
          order: 0,
        },
      ],
    },
  ];
}

async function seedPages(): Promise<void> {
  await Page.deleteOne({ pageKey: 'gallery' });

  for (const page of buildPages()) {
    await Page.findOneAndUpdate(
      { pageKey: page.pageKey },
      { $set: page },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('Pages upserted (10 records).');
}

async function seedCategories(): Promise<Record<string, Types.ObjectId>> {
  const categories = [
    { slug: 'mega-teas', name: 'Mega Teas', order: 0 },
    { slug: 'mega-tea-kits', name: 'Mega Tea Kits', order: 1 },
    { slug: 'acai-bowls', name: 'Açaí Bowls', order: 2 },
    { slug: 'protein-coffee', name: 'Protein Coffee', order: 3 },
    { slug: 'protein-shakes', name: 'Protein Shakes', order: 4 },
    { slug: 'waffles', name: 'Waffles', order: 5 },
    { slug: 'donuts', name: 'Donuts', order: 6 },
    { slug: 'protein-treats', name: 'Protein Treats', order: 7 },
    { slug: 'add-ins', name: 'Add-ins', order: 8 },
    { slug: 'new-and-seasonal-items', name: 'New and Seasonal Items', order: 9 },
  ];

  const ids: Record<string, Types.ObjectId> = {};

  for (const category of categories) {
    const doc = await ProductCategory.findOneAndUpdate(
      { slug: category.slug },
      {
        $set: {
          slug: category.slug,
          name: loc(category.name),
          description: rich(
            `<p>Explore our ${category.name} selection. Ingredient and nutrition details are added when confirmed by the business.</p>`
          ),
          image: img(getCategoryImage(category.slug), category.name),
          order: category.order,
          status: 'published',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids[category.slug] = doc._id;
  }

  console.log('Product categories upserted (10 records).');
  return ids;
}

async function seedFlavors(): Promise<Record<string, Types.ObjectId>> {
  const flavorSlugs = LOADED_TEAS.flavors.map((f) => f.slug);

  await Flavor.updateMany(
    { slug: { $nin: flavorSlugs } },
    { $set: { status: 'archived' } }
  );

  const ids: Record<string, Types.ObjectId> = {};

  for (const [index, flavor] of LOADED_TEAS.flavors.entries()) {
    const displayName = flavor.isNew ? `${flavor.name} — NEW!` : flavor.name;
    const doc = await Flavor.findOneAndUpdate(
      { slug: flavor.slug },
      {
        $set: {
          slug: flavor.slug,
          name: loc(displayName),
          category: flavor.category,
          color: flavor.color,
          description: rich(flavorIngredientsHtml(flavor.ingredients)),
          image: img(getFlavorImage(flavor.slug, displayName).url, `${displayName} loaded tea`),
          status: 'published',
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids[flavor.slug] = doc._id;
  }

  console.log(`Flavors upserted (${LOADED_TEAS.flavors.length} loaded tea records).`);
  return ids;
}

async function seedAddIns(): Promise<Record<string, Types.ObjectId>> {
  const addIns = [
    {
      slug: 'collagen',
      name: 'Collagen',
      category: 'wellness',
      description: 'Optional collagen add-in for loaded teas and kits.',
    },
    {
      slug: 'nrg-clean-energy',
      name: 'NRG (Clean Energy)',
      category: 'wellness',
      description: 'Clean energy booster add-in.',
    },
    {
      slug: 'protein',
      name: 'Protein',
      category: 'wellness',
      description: 'Protein add-in for loaded teas and kits.',
    },
    {
      slug: 'aloe',
      name: 'Aloe',
      category: 'wellness',
      description: 'Aloe add-in — Mandarin, Mango, and other varieties.',
    },
    {
      slug: 'fiber',
      name: 'Fiber',
      category: 'wellness',
      description: 'Fiber add-in for loaded teas and kits.',
    },
    {
      slug: 'probiotics',
      name: 'Probiotics',
      category: 'wellness',
      description: 'Probiotics add-in for loaded teas and kits.',
    },
    {
      slug: 'beverage-enhancers',
      name: 'Beverage Enhancers',
      category: 'customization',
      description: 'Flavor beverage enhancers for custom blends.',
    },
    {
      slug: 'vitamins-and-more',
      name: 'Vitamins & More',
      category: 'wellness',
      description: 'Vitamins and additional wellness add-ins.',
    },
  ];

  const ids: Record<string, Types.ObjectId> = {};

  for (const [index, addIn] of addIns.entries()) {
    const doc = await AddIn.findOneAndUpdate(
      { slug: addIn.slug },
      {
        $set: {
          slug: addIn.slug,
          name: loc(addIn.name),
          category: addIn.category,
          description: rich(`<p>${addIn.description}</p>`),
          price: 0,
          status: 'published',
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids[addIn.slug] = doc._id;
  }

  console.log(`Add-ins upserted (${addIns.length} records).`);
  return ids;
}

function serviceTemplate(
  slug: string,
  name: string,
  short: string,
  order: number,
  audience: string
) {
  return {
    slug,
    name: loc(name),
    shortDescription: loc(short),
    description: rich(
      `<p>${short} Request a quote to confirm packages, capacity, and pricing for your event.</p>`
    ),
    detailContent: rich(
      `<p>Fusion Fuel & Boost Co. provides ${name.toLowerCase()} with customizable menu options. We work with you on guest count, timing, dietary notes, and product selection. Confirmation follows after your inquiry is reviewed.</p><p><strong>Audience:</strong> ${audience}</p>`
    ),
    thumbnail: img(getServiceImage(slug), name),
    heroImage: img(getServiceImage(slug), `${name} hero`),
    startingPrice: undefined,
    seo: {
      title: `${name} | ${BRAND.name}`,
      description: short,
    },
    faqs: [
      {
        question: loc('How do I request a quote?'),
        answer: rich(
          '<p>Submit a catering request through our booking form with your event date, guest count, and product interests. A team member will follow up.</p>'
        ),
        order: 0,
      },
      {
        question: loc('Is my event automatically confirmed?'),
        answer: rich(
          '<p>No. Submissions are requests. Confirmation is sent after availability and details are reviewed.</p>'
        ),
        order: 1,
      },
    ],
    sections: [
      {
        title: loc('What We Provide'),
        body: rich(
          '<p>Made-to-order Mega Teas, protein-forward menu items, and event-friendly formats. Final menus are tailored to your audience and confirmed in writing.</p>'
        ),
        image: img(getServiceImage(slug), `${name} service`),
        order: 0,
      },
    ],
    status: 'published' as const,
    order,
  };
}

async function seedServices(): Promise<void> {
  const services = [
    {
      slug: 'acai-bowl-event-experience',
      name: loc(ACAI_BOWL_EVENT.name),
      shortDescription: loc(ACAI_BOWL_EVENT.headline),
      description: rich(
        `<p>${ACAI_BOWL_EVENT.headline}</p><p>${ACAI_BOWL_EVENT.serviceArea}. ${ACAI_BOWL_EVENT.deliveryNote}.</p>`
      ),
      detailContent: rich(acaiBowlEventServiceHtml()),
      thumbnail: img(getServiceImage('special-event-catering'), ACAI_BOWL_EVENT.name),
      heroImage: img(SITE_IMAGES.acaiBowl, `${ACAI_BOWL_EVENT.name} hero`),
      startingPrice: undefined,
      seo: {
        title: `${ACAI_BOWL_EVENT.name} | ${BRAND.name}`,
        description: ACAI_BOWL_EVENT.headline,
      },
      faqs: [
        {
          question: loc('What guest counts are available?'),
          answer: rich(
            `<p>Packages are available for ${ACAI_BOWL_EVENT.guestPackages.join(', ')} guests. Contact us to confirm availability for your date.</p>`
          ),
          order: 0,
        },
        {
          question: loc('What is the deposit and payment schedule?'),
          answer: rich(`<p>${ACAI_BOWL_EVENT.deposit} ${ACAI_BOWL_EVENT.balance}</p>`),
          order: 1,
        },
        {
          question: loc('Do you serve indoor and outdoor events?'),
          answer: rich(
            `<p>Yes. Your event can be indoor or outdoor. ${ACAI_BOWL_EVENT.serviceDuration}. ${ACAI_BOWL_EVENT.deliveryNote}.</p>`
          ),
          order: 2,
        },
      ],
      sections: [
        {
          title: loc('Fresh On-Site Açaí Bowl Bar'),
          body: rich(
            `<p>Guests choose fresh fruits and premium toppings while we finish each bowl at our serving station. ${ACAI_BOWL_EVENT.howItWorks[0]}</p>`
          ),
          image: img(SITE_IMAGES.acaiBowl, 'Açaí bowl event bar'),
          order: 0,
        },
      ],
      status: 'published' as const,
      order: 0,
    },
    serviceTemplate(
      'corporate-catering',
      'Corporate Catering',
      'Refresh your team with energizing Mega Teas and protein-forward options.',
      1,
      'Corporate offices and workplace events'
    ),
    serviceTemplate(
      'medical-office-catering',
      'Medical Office Catering',
      'Convenient, flavorful options for staff and patient-facing events.',
      2,
      'Medical offices and healthcare teams'
    ),
    serviceTemplate(
      'school-catering',
      'School Catering',
      'Flavorful catering formats for school events and staff appreciation.',
      3,
      'Schools and educational events'
    ),
    serviceTemplate(
      'wedding-catering',
      'Wedding Catering',
      'Bold beverage and treat stations for weddings and celebrations.',
      4,
      'Weddings and reception events'
    ),
    serviceTemplate(
      'private-party-catering',
      'Private Party Catering',
      'Custom spreads for birthdays, showers, and private gatherings.',
      5,
      'Private parties and home events'
    ),
    serviceTemplate(
      'special-event-catering',
      'Special Event Catering',
      'Flexible catering for festivals, pop-ups, and community events.',
      6,
      'Special events and organizers'
    ),
    serviceTemplate(
      'mega-tea-kit-program-club',
      'Monthly Tea Club',
      `${MONTHLY_TEA_CLUB.taglines.primary} Choose 6, 12, 20, or 30 tea kit boxes with loaded blends, guides, and wellness add-ins.`,
      7,
      'Monthly subscribers and at-home tea customers'
    ),
  ];

  for (const service of services) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      { $set: service },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('Services upserted (8 records).');
}

async function seedProducts(
  categoryIds: Record<string, Types.ObjectId>,
  flavorIds: Record<string, Types.ObjectId>,
  addInIds: Record<string, Types.ObjectId>
): Promise<void> {
  const allFlavorIds = Object.values(flavorIds);
  const addInOptions = Object.values(addInIds).map((addInId) => ({
    addInId,
    maxQuantity: 2,
    included: false,
  }));

  const kitSizes = [
    { key: '6', name: loc('6 Tea Kit Box'), servings: 6, price: 0 },
    { key: '12', name: loc('12 Tea Kit Box'), servings: 12, price: 0 },
    { key: '20', name: loc('20 Tea Kit Box'), servings: 20, price: 0 },
    { key: '30', name: loc('30 Tea Kit Box'), servings: 30, price: 0 },
  ];

  const draftProducts = [
    {
      slug: 'signature-mega-tea',
      sku: 'FFB-MTEA-001',
      name: 'Signature Mega Tea',
      category: 'mega-teas',
      productType: 'single' as const,
      short: 'A customizable Mega Tea made to order. Contact for pricing.',
      image: getProductFallbackImage('mega-teas'),
    },
    {
      slug: 'tropical-acai-bowl',
      sku: 'FFB-ACAI-001',
      name: 'Tropical Açaí Bowl',
      category: 'acai-bowls',
      productType: 'single' as const,
      short: 'Açaí bowl with customizable toppings. Contact for pricing.',
      image: getProductFallbackImage('acai-bowls'),
    },
    {
      slug: 'protein-cold-brew',
      sku: 'FFB-PCOF-001',
      name: 'Protein Cold Brew',
      category: 'protein-coffee',
      productType: 'single' as const,
      short: 'Protein-forward coffee option. Caffeine details to be confirmed.',
      image: getProductFallbackImage('protein-coffee'),
    },
    {
      slug: 'chocolate-protein-shake',
      sku: 'FFB-PSHK-001',
      name: 'Chocolate Protein Shake',
      category: 'protein-shakes',
      productType: 'single' as const,
      short: 'Rich shake format. Nutrition facts to be added by admin.',
      image: getProductFallbackImage('protein-shakes'),
    },
    {
      slug: 'fusion-waffle',
      sku: 'FFB-WAFL-001',
      name: 'Fusion Waffle',
      category: 'waffles',
      productType: 'single' as const,
      short: 'Protein-forward waffle treat. Contact for pricing.',
      image: getProductFallbackImage('waffles'),
    },
    {
      slug: 'boost-donut',
      sku: 'FFB-DONT-001',
      name: 'Boost Donut',
      category: 'donuts',
      productType: 'single' as const,
      short: 'Protein-focused donut option. Contact for pricing.',
      image: getProductFallbackImage('donuts'),
    },
    {
      slug: 'protein-energy-bite',
      sku: 'FFB-TRET-001',
      name: 'Protein Energy Bite',
      category: 'protein-treats',
      productType: 'single' as const,
      short: 'Portable protein treat. Ingredient list pending client confirmation.',
      image: getProductFallbackImage('protein-treats'),
    },
    {
      slug: 'seasonal-feature',
      sku: 'FFB-SEAS-001',
      name: 'Seasonal Feature Item',
      category: 'new-and-seasonal-items',
      productType: 'single' as const,
      short: 'Limited seasonal menu placeholder. Contact for pricing.',
      image: getProductFallbackImage('new-and-seasonal-items'),
    },
  ];

  for (const [index, product] of draftProducts.entries()) {
    await Product.findOneAndUpdate(
      { slug: product.slug },
      {
        $set: {
          slug: product.slug,
          sku: product.sku,
          name: loc(product.name),
          shortDescription: loc(product.short),
          description: rich(
            `<p>${product.short}</p><p>Prices, ingredients, allergens, and nutrition information are configured in the admin portal. This product remains in draft until confirmed.</p>`
          ),
          productType: product.productType,
          categoryId: categoryIds[product.category],
          images: [img(product.image, product.name)],
          basePrice: 0,
          variants: [],
          flavorIds: allFlavorIds,
          kitSizes: [],
          addInOptions: product.category === 'mega-teas' ? addInOptions : [],
          inventory: {
            trackInventory: false,
            quantity: 0,
            lowStockThreshold: 5,
            allowBackorder: false,
          },
          allergens: [],
          dietaryTags: [],
          seo: {
            title: `${product.name} | ${BRAND.name}`,
            description: product.short,
          },
          status: 'draft',
          featured: index < 3,
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Product.findOneAndUpdate(
    { slug: 'mega-tea-kit-builder' },
    {
      $set: {
        slug: 'mega-tea-kit-builder',
        sku: 'FFB-KIT-001',
        name: loc('Monthly Tea Club Kit Builder'),
        shortDescription: loc(
          `${MONTHLY_TEA_CLUB.intro} Choose a 6, 12, 20, or 30 tea kit box. ${MONTHLY_TEA_CLUB.ctaDetail}`
        ),
        description: rich(
          `<p><strong>${MONTHLY_TEA_CLUB.taglines.primary}</strong></p><p>${MONTHLY_TEA_CLUB.taglines.product}</p><ul>${MONTHLY_TEA_CLUB.whatsInside.map((item) => `<li>${item}</li>`).join('')}</ul><p>${DELIVERY.local} ${DELIVERY.nationwide}</p><p>Choose your kit size, select flavors from our catalog, and add optional wellness boosters such as collagen, hydration booster, aloe vera, or an extra flavor shot.</p>`
        ),
        productType: 'kit',
        categoryId: categoryIds['mega-tea-kits'],
        images: [img(SITE_IMAGES.megaTeaKit, 'Mega Tea Kit Builder')],
        basePrice: 0,
        variants: [],
        flavorIds: allFlavorIds,
        kitSizes,
        addInOptions,
        inventory: {
          trackInventory: false,
          quantity: 0,
          lowStockThreshold: 5,
          allowBackorder: false,
        },
        allergens: [],
        dietaryTags: [],
        seo: {
          title: `Monthly Tea Club | ${BRAND.name}`,
          description:
            `${MONTHLY_TEA_CLUB.taglines.primary} ${MONTHLY_TEA_CLUB.whatsInside.join(', ')}.`,
        },
        status: 'draft',
        featured: true,
        order: 0,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Products upserted (9 draft records including kit builder).');
}

async function seedFaqs(): Promise<void> {
  const faqs = [
    {
      category: 'general',
      question: 'Do your products treat or prevent disease?',
      answer:
        'No. Our products are food and beverage items designed to complement an active lifestyle. They are not intended to diagnose, treat, cure, or prevent any disease.',
      order: 0,
    },
    {
      category: 'general',
      question: 'Can you guarantee weight loss or sustained energy?',
      answer:
        'No. Individual results and nutritional needs vary. We provide ingredient and nutrition details when confirmed by the business, but we do not guarantee specific outcomes.',
      order: 1,
    },
    {
      category: 'mega-tea-kits',
      question: 'What is the Monthly Tea Club?',
      answer:
        'Our Monthly Tea Club delivers a curated box of loaded tea blends, an easy step-by-step guide, wellness boosters, sweet extras, and new flavors each month. Choose a 6, 12, 20, or 30 tea kit box plan.',
      order: 0,
    },
    {
      category: 'mega-tea-kits',
      question: 'How do I join the Monthly Tea Club?',
      answer:
        `${MONTHLY_TEA_CLUB.ctaDetail} Call ${CONTACT.phone}, email ${CONTACT.email}, or message us on Instagram at ${CONTACT.instagramHandle}.`,
      order: 1,
    },
    {
      category: 'mega-tea-kits',
      question: 'How many flavors can I choose in a tea kit box?',
      answer:
        'Flavor selection limits depend on kit size and admin configuration. The kit builder supports searchable flavor selection with limits set per serving size.',
      order: 2,
    },
    {
      category: 'mega-tea-kits',
      question: 'What add-ins are available for kits?',
      answer:
        'Optional wellness boosters and add-ins may include collagen, hydration booster, aloe vera, and extra flavor shots. Availability and pricing are managed in the admin portal.',
      order: 3,
    },
    {
      category: 'mega-tea-kits',
      question: 'Do you offer local delivery or shipping?',
      answer: `${DELIVERY.local} ${DELIVERY.nationwide}`,
      order: 4,
    },
    {
      category: 'products',
      question: 'Do your menu items contain caffeine?',
      answer:
        'Some products may contain caffeine. Approximate caffeine amounts and warnings are displayed when provided and verified by the business.',
      order: 0,
    },
    {
      category: 'products',
      question: 'Are products vegan, gluten-free, or allergen-free?',
      answer:
        'Dietary tags and allergen information are applied only when verified by the business. Check individual product pages for confirmed details.',
      order: 1,
    },
    {
      category: 'catering',
      question: 'Is my catering request automatically confirmed?',
      answer:
        'No. Booking submissions are requests. You will receive an acknowledgement, and a team member will follow up to confirm availability and details.',
      order: 0,
    },
    {
      category: 'catering',
      question: 'Do you cater events, parties, and offices?',
      answer: CATERING_TAGLINE,
      order: 1,
    },
    {
      category: 'catering',
      question: 'What is included in the Açaí Bowl Event Experience?',
      answer: `${ACAI_BOWL_EVENT.packageIncludes.join('; ')}. ${ACAI_BOWL_EVENT.serviceDuration}.`,
      order: 2,
    },
    {
      category: 'orders',
      question: 'Why do some products say contact for pricing?',
      answer:
        'Prices are entered by the administrator when confirmed. Draft products with zero price cannot complete paid checkout until pricing is configured.',
      order: 0,
    },
    {
      category: 'orders',
      question: 'How are payments processed?',
      answer:
        'Online orders are processed through Stripe. Payment status is updated only after a verified Stripe webhook—not from the browser redirect alone.',
      order: 1,
    },
  ];

  for (const faq of faqs) {
    await FAQ.findOneAndUpdate(
      {
        category: faq.category,
        'question.en': faq.question,
      },
      {
        $set: {
          category: faq.category,
          question: loc(faq.question),
          answer: rich(`<p>${faq.answer}</p>`),
          locale: ['en', 'es'],
          order: faq.order,
          status: 'published',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('FAQs upserted (13 records).');
}

async function seedPromotions(): Promise<void> {
  await Promotion.findOneAndUpdate(
    { code: 'BUY10GET1' },
    {
      $set: {
        code: 'BUY10GET1',
        name: 'Buy 10 Mega Tea Kits Get 1 Free (Template)',
        description:
          'DISABLED TEMPLATE: Buy 10 Mega Tea kits and receive one free. Configure eligibility, product scope, dates, and discount logic before activating. Do not enable both this and free shipping without reviewing rules.',
        type: 'fixed_amount',
        rules: {
          discountValue: 0,
          minimumOrderAmount: 0,
          applicableCategoryIds: [],
          applicableProductIds: [],
        },
        eligibility: {
          firstOrderOnly: false,
        },
        limits: {
          maxUses: undefined,
          maxUsesPerCustomer: undefined,
          currentUses: 0,
        },
        active: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Promotion.findOneAndUpdate(
    { code: 'FREESHIP' },
    {
      $set: {
        code: 'FREESHIP',
        name: 'Free Shipping (Template)',
        description:
          'DISABLED TEMPLATE: Free shipping promotion. Configure minimum order amount, eligible zones, dates, and usage limits before activating.',
        type: 'free_shipping',
        rules: {
          discountValue: 0,
          minimumOrderAmount: 0,
        },
        eligibility: {
          firstOrderOnly: false,
        },
        limits: {
          currentUses: 0,
        },
        active: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Promotion templates upserted (2 inactive records).');
}

async function main(): Promise<void> {
  console.log('Starting Fusion Fuel & Boost Co. seed...\n');

  await connect();

  await seedAdmin();
  await seedSiteSettings();
  await seedPages();

  const categoryIds = await seedCategories();
  const flavorIds = await seedFlavors();
  const addInIds = await seedAddIns();

  await seedServices();
  await seedProducts(categoryIds, flavorIds, addInIds);
  await seedFaqs();
  await seedPromotions();

  console.log('\nSeed completed successfully.');
  console.log('Note: No orders, testimonials, or fake reviews were created.');
  console.log('Draft products use basePrice 0 until admin sets real prices.');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
