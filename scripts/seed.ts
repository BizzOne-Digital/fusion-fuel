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
import { SITE_IMAGES, getCategoryImage, getServiceImage, getProductFallbackImage } from '../src/lib/site-images';

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
        contactEmail: 'fusionfuelboostco@gmail.com',
        contactPhone: '786-712-2133',
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
            'Mega Teas, açaí bowls, protein coffee, shakes, waffles, donuts, and Mega Tea Kit Program Club. Catering for corporate, medical, school, and special events.',
          keywords: [
            'mega tea',
            'protein shakes',
            'acai bowls',
            'catering',
            'fusion fuel boost',
          ],
          ogImage: img(SITE_IMAGES.hero, 'Fusion Fuel & Boost Co.'),
        },
        announcement: {
          enabled: false,
          message: loc('Welcome to Fusion Fuel & Boost Co.'),
          link: '/en/products',
          backgroundColor: '#10161A',
          textColor: '#E8F000',
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
                { label: loc('Mega Tea Kits'), href: '/en/products/mega-tea-kit-builder' },
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
            url: 'https://www.instagram.com/pereira_katerine?igsh=cGNiajFwZzNndjly',
            label: '@pereira_katerine',
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
    label: loc('Shop Mega Tea Kits'),
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
          'Explore Mega Teas, protein-forward menu items, Mega Tea Kit Program Club, and full-service catering.',
      },
      hero: {
        title: loc('FUEL YOUR DAY. BOOST YOUR LIFE.'),
        subtitle: loc(
          'Energizing Mega Teas, açaí bowls, protein coffee, shakes, waffles, donuts, and customizable Mega Tea Kits.'
        ),
        backgroundImage: img(SITE_IMAGES.hero, 'Fusion Fuel hero'),
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
          title: loc('Mega Tea Kit Program Club'),
          body: rich(
            '<p>Build your kit at home with 6, 12, 20, or 30 servings and choose from a searchable flavor catalog with optional add-ins.</p>'
          ),
          cta: {
            label: loc('Build Your Kit'),
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
            '<p>Corporate offices, medical practices, schools, weddings, private parties, and special celebrations. Request a quote to confirm availability and pricing.</p>'
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
            '<p>We cater corporate gatherings, medical offices, schools, weddings, private parties, and special events. Packages, minimums, and pricing are confirmed after your inquiry.</p>'
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
            '<p>Product and catering prices are managed in the admin portal and will be published when confirmed. Results and nutritional needs vary by individual.</p>'
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
        subtitle: loc('Email fusionfuelboostco@gmail.com or call 786-712-2133.'),
        backgroundImage: img(SITE_IMAGES.contact, 'Contact Fusion Fuel'),
      },
      sections: [
        {
          key: 'contact-details',
          type: 'text' as const,
          title: loc('Contact Information'),
          body: rich(
            '<p><strong>Email:</strong> fusionfuelboostco@gmail.com<br/><strong>Phone:</strong> 786-712-2133<br/><strong>Instagram:</strong> @pereira_katerine</p><p>Business address and hours will appear here once confirmed by the client.</p>'
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
  const flavors = [
    { slug: 'strawberry', name: 'Strawberry', category: 'fruit', color: '#FF315E' },
    { slug: 'blue-raspberry', name: 'Blue Raspberry', category: 'fruit', color: '#2EC4B6' },
    { slug: 'mango', name: 'Mango', category: 'fruit', color: '#FFE500' },
    { slug: 'peach', name: 'Peach', category: 'fruit', color: '#FF9F68' },
    { slug: 'watermelon', name: 'Watermelon', category: 'fruit', color: '#FF6B8A' },
    { slug: 'pineapple', name: 'Pineapple', category: 'tropical', color: '#FFD166' },
    { slug: 'cherry', name: 'Cherry', category: 'fruit', color: '#DC2626' },
    { slug: 'green-apple', name: 'Green Apple', category: 'fruit', color: '#84CC16' },
    { slug: 'original-mega-tea', name: 'Original Mega Tea', category: 'tea', color: '#E8F000' },
    { slug: 'green-tea', name: 'Green Tea', category: 'tea', color: '#10B981' },
    { slug: 'herbal-blend', name: 'Herbal Blend', category: 'tea', color: '#687078' },
    { slug: 'chai-spice', name: 'Chai Spice', category: 'tea', color: '#D97706' },
    { slug: 'coconut', name: 'Coconut', category: 'tropical', color: '#FFF8E7' },
    { slug: 'passion-fruit', name: 'Passion Fruit', category: 'tropical', color: '#9333EA' },
    { slug: 'guava', name: 'Guava', category: 'tropical', color: '#FB7185' },
    { slug: 'kiwi', name: 'Kiwi', category: 'tropical', color: '#65A30D' },
    { slug: 'electric-lemon', name: 'Electric Lemon', category: 'citrus', color: '#EAB308' },
    { slug: 'berry-blast', name: 'Berry Blast', category: 'fruit', color: '#7C3AED' },
    { slug: 'citrus-punch', name: 'Citrus Punch', category: 'citrus', color: '#F97316' },
    { slug: 'lemon', name: 'Lemon', category: 'citrus', color: '#FACC15' },
    { slug: 'raspberry', name: 'Raspberry', category: 'fruit', color: '#E11D48' },
    { slug: 'blueberry', name: 'Blueberry', category: 'fruit', color: '#3B82F6' },
  ];

  const ids: Record<string, Types.ObjectId> = {};

  for (const [index, flavor] of flavors.entries()) {
    const doc = await Flavor.findOneAndUpdate(
      { slug: flavor.slug },
      {
        $set: {
          slug: flavor.slug,
          name: loc(flavor.name),
          category: flavor.category,
          color: flavor.color,
          description: rich(
            `<p>${flavor.name} flavor profile for Mega Tea Kit builder demos. Customize serving selections in the kit builder.</p>`
          ),
          status: 'published',
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids[flavor.slug] = doc._id;
  }

  console.log(`Flavors upserted (${flavors.length} records).`);
  return ids;
}

async function seedAddIns(): Promise<Record<string, Types.ObjectId>> {
  const addIns = [
    {
      slug: 'collagen',
      name: 'Collagen',
      category: 'wellness',
      description: 'Optional collagen add-in. Confirm ingredients and pricing in admin before publishing.',
    },
    {
      slug: 'hydration-booster',
      name: 'Hydration Booster',
      category: 'wellness',
      description: 'Optional hydration booster add-in for kit customization.',
    },
    {
      slug: 'aloe-vera',
      name: 'Aloe Vera',
      category: 'wellness',
      description: 'Optional aloe vera add-in. Ingredient details to be confirmed by the business.',
    },
    {
      slug: 'extra-flavor',
      name: 'Extra Flavor',
      category: 'customization',
      description: 'Add an extra flavor shot to your Mega Tea Kit selection.',
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

  console.log('Add-ins upserted (4 records).');
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
    serviceTemplate(
      'corporate-catering',
      'Corporate Catering',
      'Refresh your team with energizing Mega Teas and protein-forward options.',
      0,
      'Corporate offices and workplace events'
    ),
    serviceTemplate(
      'medical-office-catering',
      'Medical Office Catering',
      'Convenient, flavorful options for staff and patient-facing events.',
      1,
      'Medical offices and healthcare teams'
    ),
    serviceTemplate(
      'school-catering',
      'School Catering',
      'Flavorful catering formats for school events and staff appreciation.',
      2,
      'Schools and educational events'
    ),
    serviceTemplate(
      'wedding-catering',
      'Wedding Catering',
      'Bold beverage and treat stations for weddings and celebrations.',
      3,
      'Weddings and reception events'
    ),
    serviceTemplate(
      'private-party-catering',
      'Private Party Catering',
      'Custom spreads for birthdays, showers, and private gatherings.',
      4,
      'Private parties and home events'
    ),
    serviceTemplate(
      'special-event-catering',
      'Special Event Catering',
      'Flexible catering for festivals, pop-ups, and community events.',
      5,
      'Special events and organizers'
    ),
    serviceTemplate(
      'mega-tea-kit-program-club',
      'Mega Tea Kit Program Club',
      'Prepare favorite Mega Tea combinations at home with kit sizes from 6 to 30 servings.',
      6,
      'At-home kit customers and repeat buyers'
    ),
  ];

  for (const service of services) {
    await Service.findOneAndUpdate(
      { slug: service.slug },
      { $set: service },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('Services upserted (7 records).');
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
    { key: '6', name: loc('6 Servings'), servings: 6, price: 0 },
    { key: '12', name: loc('12 Servings'), servings: 12, price: 0 },
    { key: '20', name: loc('20 Servings'), servings: 20, price: 0 },
    { key: '30', name: loc('30 Servings'), servings: 30, price: 0 },
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
          flavorIds: product.category === 'mega-teas' ? allFlavorIds.slice(0, 8) : [],
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
        name: loc('Mega Tea Kit Builder'),
        shortDescription: loc(
          'Build your at-home Mega Tea Kit with 6, 12, 20, or 30 servings. Contact for pricing.'
        ),
        description: rich(
          '<p>Choose your kit size, select flavors from our catalog, and add optional boosters such as collagen, hydration booster, aloe vera, or an extra flavor shot.</p><p>Pricing is set per serving size in the admin portal. Products with zero price remain unavailable for paid checkout until configured.</p>'
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
          title: `Mega Tea Kit Builder | ${BRAND.name}`,
          description:
            'Customize Mega Tea Kits with multiple serving sizes and flavor combinations.',
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
      question: 'How many flavors can I choose in a Mega Tea Kit?',
      answer:
        'Flavor selection limits depend on kit size and admin configuration. The kit builder supports searchable flavor selection with limits set per serving size.',
      order: 0,
    },
    {
      category: 'mega-tea-kits',
      question: 'What add-ins are available for kits?',
      answer:
        'Optional add-ins may include collagen, hydration booster, aloe vera, and extra flavor shots. Availability and pricing are managed in the admin portal.',
      order: 1,
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

  console.log('FAQs upserted (9 records).');
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
