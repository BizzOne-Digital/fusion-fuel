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
import { FLAVOR_IMAGE_BY_SLUG } from '../src/lib/flavor-image-manifest';
import { CATERING_TAGLINE, CONTACT, DELIVERY, acaiBowlEventServiceHtml, ACAI_BOWL_EVENT, flavorIngredientsHtml, HOME_HERO, LOADED_TEAS, MONTHLY_TEA_CLUB } from '../src/lib/brand-content';
import { PROTEIN_COFFEE, proteinCoffeeIcedPriceCents, proteinCoffeeOptionalAddInSlugs, proteinCoffeeProductDescriptionHtml, proteinCoffeeProductShortDescription, PROTEIN_COFFEE_PRODUCT_SLUG } from '../src/lib/protein-coffee-menu';
import { MEGA_TEA_KIT_COLLECTIONS, MEGA_TEA_KITS_MENU, megaTeaKitDescriptionHtml, megaTeaKitOptionalAddInSlugs, megaTeaKitPriceCents, megaTeaKitProductName, megaTeaKitShortDescription } from '../src/lib/mega-tea-kits-menu';
import { MENU_FLAVORS } from '../src/lib/menu-flavors';
import { LOADED_TEAS_MENU, LOADED_TEA_PRODUCT_SLUG, loadedTeaOptionalAddInSlugs, loadedTeaProductDescriptionHtml, loadedTeaProductShortDescription, loadedTeaSizePriceCents } from '../src/lib/loaded-teas-menu';
import { ACAI_BOWLS_MENU, acaiBowlDescriptionHtml, acaiBowlExtraAddInSlugs, acaiBowlModifierSlug, acaiBowlPriceCents, acaiBowlShortDescription } from '../src/lib/acai-bowls-menu';
import { WAFFLES_MENU, waffleDescriptionHtml, waffleExtraAddInSlugs, waffleExtraModifierSlug, wafflePriceCents, waffleShortDescription } from '../src/lib/waffles-menu';
import { DONUT_OF_THE_DAY_MENU, donutOfTheDayPricingSummary } from '../src/lib/donut-of-the-day-menu';
import {
  PROTEIN_TREATS_MENU,
  proteinTreatDescriptionHtml,
  proteinTreatItemPriceCents,
  proteinTreatItemVariants,
  proteinTreatItemImage,
  proteinTreatPieImages,
  proteinTreatShortDescription,
} from '../src/lib/protein-treats-menu';
import {
  PROTEIN_SHAKES_MENU,
  PROTEIN_SHAKE_PRODUCT_SLUG,
  proteinShakeOptionalAddInSlugs,
  proteinShakeProductDescriptionHtml,
  proteinShakeProductShortDescription,
  proteinShakeProductSlug,
  proteinShakeSizePriceCents,
} from '../src/lib/protein-shakes-menu';

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

function menuImages(name: string, primary?: string, hover?: string) {
  const images: ReturnType<typeof img>[] = [];
  if (primary) images.push(img(primary, name));
  if (hover) images.push(img(hover, `${name} alternate view`));
  return images;
}

function menuItemImage(item: Record<string, unknown>, name: string) {
  const primary = typeof item.image === 'string' ? item.image : undefined;
  const hover = typeof item.hoverImage === 'string' ? item.hoverImage : undefined;
  return menuImages(name, primary, hover);
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
            'Monthly Tea Club, Loaded Teas, protein coffee, waffles, protein treats, and full-service catering. Local delivery and nationwide shipping.',
          keywords: [
            'monthly tea club',
            'loaded teas',
            'protein coffee',
            'acai bowls',
            'catering',
            'fusion fuel boost',
          ],
          ogImage: img(SITE_IMAGES.hero, 'Fusion Fuel & Boost Co.'),
        },
        announcement: {
          enabled: true,
          message: loc('Mega Tea Kits • 100+ Flavor Combinations'),
          link: '/en/menu?category=mega-tea-kits',
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
                { label: loc('Monthly Tea Club'), href: '/en/menu?category=mega-tea-kits' },
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
          {
            platform: 'facebook',
            url: CONTACT.facebookUrl,
            label: CONTACT.facebookLabel,
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
    href: '/en/menu?category=mega-tea-kits',
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
          'Monthly Tea Club, Loaded Teas, protein-forward menu items, and full-service catering.',
      },
      hero: {
        title: loc('FUEL YOUR DAY. BOOST YOUR LIFE.'),
        subtitle: loc(HOME_HERO.description),
        backgroundImage: img(SITE_IMAGES.heroDrinks, 'Fusion Fuel Loaded Tea hero'),
        cta: ctaShop,
      },
      sections: [
        {
          key: 'intro',
          type: 'text' as const,
          title: loc('Welcome to Fusion Fuel & Boost Co.'),
          body: rich(
            '<p>Fusion Fuel & Boost Co. offers a diverse selection of flavorful products designed to complement an active lifestyle. From made-to-order Loaded Teas to protein-forward treats and customizable kits, every item is built around bold taste and everyday convenience.</p>'
          ),
          order: 0,
          theme: 'light' as const,
        },
        {
          key: 'mega-tea-showcase',
          type: 'image_text' as const,
          title: loc('Loaded Tea Energy'),
          body: rich(
            '<p>Discover vibrant Loaded Tea flavors with customizable add-ins. Ingredient and nutrition details are available for each product once confirmed by the business.</p>'
          ),
          images: [img(SITE_IMAGES.megaTea, 'Loaded Tea cups')],
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
            href: '/en/menu?category=mega-tea-kits',
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
        subtitle: loc('Loaded Teas, bowls, coffee, waffles, and protein treats.'),
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
            `<p><strong>Email:</strong> ${CONTACT.email}<br/><strong>Phone:</strong> ${CONTACT.phone}<br/><strong>Instagram:</strong> ${CONTACT.instagramHandle}<br/><strong>Facebook:</strong> <a href="${CONTACT.facebookUrl}">${CONTACT.facebookLabel}</a></p><p>${MONTHLY_TEA_CLUB.ctaDetail}</p><p>${DELIVERY.local} ${DELIVERY.nationwide}</p>`
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
    { slug: 'mega-teas', name: 'Loaded Teas', order: 0 },
    { slug: 'mega-tea-kits', name: 'Mega Tea Kits', order: 1 },
    { slug: 'acai-bowls', name: 'Açaí Bowls', order: 2 },
    { slug: 'protein-coffee', name: 'Protein Coffee', order: 3 },
    { slug: 'protein-shakes', name: 'Protein Shakes', order: 4 },
    { slug: 'waffles', name: 'Waffles', order: 5 },
    { slug: 'protein-treats', name: 'Protein Treats', order: 6 },
    { slug: 'donut-of-the-day', name: 'Donut of the Day', order: 7 },
  ];

  const ids: Record<string, Types.ObjectId> = {};
  const activeSlugs = categories.map((category) => category.slug);

  for (const category of categories) {
    const descriptionHtml =
      category.slug === 'donut-of-the-day'
        ? `<p>${DONUT_OF_THE_DAY_MENU.description}</p><p><strong>${donutOfTheDayPricingSummary()}</strong></p><p><em>${DONUT_OF_THE_DAY_MENU.footnote}</em></p>`
        : `<p>Explore our ${category.name} selection. Ingredient and nutrition details are added when confirmed by the business.</p>`;

    const doc = await ProductCategory.findOneAndUpdate(
      { slug: category.slug },
      {
        $set: {
          slug: category.slug,
          name: loc(category.name),
          description: rich(descriptionHtml),
          image: img(getCategoryImage(category.slug), category.name),
          order: category.order,
          status: 'published',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids[category.slug] = doc._id;
  }

  await ProductCategory.updateMany(
    { slug: { $nin: activeSlugs }, status: 'published' },
    { $set: { status: 'archived' } }
  );

  console.log(`Product categories upserted (${categories.length} records).`);
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
    const manifestImage = FLAVOR_IMAGE_BY_SLUG[flavor.slug];
    const doc = await Flavor.findOneAndUpdate(
      { slug: flavor.slug },
      {
        $set: {
          slug: flavor.slug,
          name: loc(displayName),
          category: flavor.category,
          color: flavor.color,
          description: rich(flavorIngredientsHtml(flavor.ingredients)),
          status: 'published',
          order: index,
          ...(manifestImage
            ? { image: img(manifestImage.url, `${displayName} loaded tea`) }
            : {}),
        },
        ...(manifestImage ? {} : { $unset: { image: '' } }),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids[flavor.slug] = doc._id;
  }

  console.log(`Flavors upserted (${LOADED_TEAS.flavors.length} loaded tea records).`);
  return ids;
}

async function seedAddIns(): Promise<Record<string, Types.ObjectId>> {
  const acaiExtraAddIns = [
    ...ACAI_BOWLS_MENU.extraFruits.map((name) => ({
      slug: acaiBowlModifierSlug('extra-fruit', name),
      name: `Extra Fruit — ${name}`,
      category: 'acai-extra-fruit',
      description: `Extra ${name} for açaí bowls.`,
      price: 100,
    })),
    ...ACAI_BOWLS_MENU.extraToppings.map((name) => ({
      slug: acaiBowlModifierSlug('extra-topping', name),
      name: `Extra Topping — ${name}`,
      category: 'acai-extra-topping',
      description: `Extra ${name} for açaí bowls.`,
      price: 100,
    })),
  ];

  const waffleExtraAddIns = WAFFLES_MENU.toppingGroups
    .flatMap((group) => group.items)
    .map((name) => ({
      slug: waffleExtraModifierSlug(name),
      name: `Extra Waffle Topping — ${name}`,
      category: 'waffle-extra-topping',
      description: `Extra ${name} for protein waffles.`,
      price: 100,
    }));

  const proteinCoffeeAddIns = PROTEIN_COFFEE.optionalAddOns.map((addOn) => ({
      slug: addOn.slug,
      name: addOn.name,
      category: 'protein-coffee',
      description: `${addOn.name} optional add-on for protein coffee.`,
      price: Math.round(addOn.price * 100),
    }));

  const proteinShakeAddIns = PROTEIN_SHAKES_MENU.optionalAddOns.map((addOn) => ({
    slug: addOn.slug,
    name: addOn.name,
    category: 'protein-shakes',
    description: `${addOn.name} optional add-on for protein shakes.`,
    price: Math.round(addOn.price * 100),
  }));

  const megaTeaKitAddIns = MEGA_TEA_KITS_MENU.optionalAddOns.map((addOn) => ({
    slug: addOn.slug,
    name: addOn.name,
    category: 'mega-tea-kits',
    description: `${addOn.name} add-on for Mega Tea Kits.`,
    price: Math.round(addOn.price * 100),
  }));

  const loadedTeaAddIns = LOADED_TEAS_MENU.optionalAddOns.map((addOn) => ({
    slug: addOn.slug,
    name: addOn.name,
    category: 'loaded-teas',
    description: addOn.description,
    price: Math.round(addOn.price * 100),
  }));

  const addIns = [
    {
      slug: 'additional-topping',
      name: 'Additional Topping',
      category: 'topping',
      description: 'Extra topping for waffles.',
      price: 100,
    },
    ...acaiExtraAddIns,
    ...waffleExtraAddIns,
    ...proteinCoffeeAddIns,
    ...proteinShakeAddIns,
    ...megaTeaKitAddIns,
    ...loadedTeaAddIns,
  ];

  const ids: Record<string, Types.ObjectId> = {};
  const activeSlugs = addIns.map((addIn) => addIn.slug);

  for (const [index, addIn] of addIns.entries()) {
    const doc = await AddIn.findOneAndUpdate(
      { slug: addIn.slug },
      {
        $set: {
          slug: addIn.slug,
          name: loc(addIn.name),
          category: addIn.category,
          description: rich(`<p>${addIn.description}</p>`),
          price: addIn.price ?? 0,
          status: 'published',
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids[addIn.slug] = doc._id;
  }

  await AddIn.updateMany(
    { slug: { $nin: activeSlugs }, status: 'published' },
    { $set: { status: 'archived' } }
  );

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
          '<p>Made-to-order Loaded Teas, protein-forward menu items, and event-friendly formats. Final menus are tailored to your audience and confirmed in writing.</p>'
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
      'Refresh your team with energizing Loaded Teas and protein-forward options.',
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

  const draftProducts: Array<{
    slug: string;
    sku: string;
    name: string;
    category: string;
    productType: 'single';
    short: string;
    image: string;
  }> = [];

  const archivedProductSlugs = [
    'signature-mega-tea',
    'chocolate-protein-shake',
    'boost-donut',
    'seasonal-feature',
    'protein-cold-brew',
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

  await Product.updateMany(
    { slug: { $in: archivedProductSlugs } },
    { $set: { status: 'archived' } }
  );

  console.log('Products upserted (draft catalog).');
}

async function seedMegaTeaKitProducts(
  categoryIds: Record<string, Types.ObjectId>,
  flavorIds: Record<string, Types.ObjectId>,
  addInOptions: Array<{ addInId: Types.ObjectId; maxQuantity: number; included: boolean }>
): Promise<void> {
  const kitSizes = [
    {
      key: 'standard',
      name: loc(MEGA_TEA_KITS_MENU.headline),
      servings: 1,
      price: megaTeaKitPriceCents(),
    },
  ];

  await Product.updateOne(
    { slug: 'mega-tea-kit-builder' },
    { $set: { status: 'archived', sku: 'FFB-KIT-LEGACY' } }
  );

  const activeSlugs = MEGA_TEA_KIT_COLLECTIONS.map((collection) => collection.productSlug);

  for (const [index, collection] of MEGA_TEA_KIT_COLLECTIONS.entries()) {
    const collectionFlavorIds = MENU_FLAVORS.filter(
      (flavor) => flavor.collection === collection.collectionSlug
    )
      .map((flavor) => flavorIds[flavor.slug])
      .filter(Boolean);

    const sku = `FFB-KIT-${String(index + 1).padStart(3, '0')}`;

    await Product.findOneAndUpdate(
      { slug: collection.productSlug },
      {
        $set: {
          slug: collection.productSlug,
          sku,
          name: loc(megaTeaKitProductName(collection.name)),
          shortDescription: loc(megaTeaKitShortDescription(collection.name)),
          description: rich(megaTeaKitDescriptionHtml(collection.name)),
          productType: 'kit',
          categoryId: categoryIds['mega-tea-kits'],
          images: [
            img(MEGA_TEA_KITS_MENU.heroImage.url, `${collection.name} Mega Tea Kit`),
          ],
          basePrice: megaTeaKitPriceCents(),
          variants: [],
          flavorIds: collectionFlavorIds,
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
            title: `${megaTeaKitProductName(collection.name)} | ${BRAND.name}`,
            description: megaTeaKitShortDescription(collection.name),
          },
          status: 'published',
          featured: index === 0,
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Product.updateMany(
    {
      categoryId: categoryIds['mega-tea-kits'],
      slug: { $nin: [...activeSlugs, 'mega-tea-kit-builder'] },
      status: 'published',
    },
    { $set: { status: 'archived' } }
  );

  console.log(`Mega Tea Kit products upserted (${MEGA_TEA_KIT_COLLECTIONS.length} records).`);
}

async function seedProteinCoffeeProducts(
  categoryIds: Record<string, Types.ObjectId>,
  addInOptions: Array<{ addInId: Types.ObjectId; maxQuantity: number; included: boolean }>
): Promise<void> {
  const { galleryImages, headline } = PROTEIN_COFFEE;
  const productImages = galleryImages.map((image) => img(image.url, image.alt));
  const legacyFlavorSlugs = PROTEIN_COFFEE.flavors.map((flavor) => `protein-coffee-${flavor.slug}`);

  await Product.updateOne(
    { slug: 'protein-cold-brew' },
    { $set: { status: 'archived', sku: 'FFB-PCOF-LEGACY' } }
  );
  await Product.updateMany(
    { slug: { $in: legacyFlavorSlugs } },
    { $set: { status: 'archived' } }
  );

  const sku = 'FFB-PCOF';
  const slug = PROTEIN_COFFEE_PRODUCT_SLUG;

  await Product.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        sku,
        name: loc(headline),
        shortDescription: loc(proteinCoffeeProductShortDescription()),
        description: rich(proteinCoffeeProductDescriptionHtml()),
        productType: 'single',
        categoryId: categoryIds['protein-coffee'],
        images: productImages,
        basePrice: proteinCoffeeIcedPriceCents('24oz'),
        variants: PROTEIN_COFFEE.icedSizes.map((size) => ({
          sku: `${sku}-${size.variantSuffix}`,
          name: loc(size.name),
          price: proteinCoffeeIcedPriceCents(size.slug),
          inventory: 0,
        })),
        flavorIds: [],
        kitSizes: [],
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
          title: `${headline} | ${BRAND.name}`,
          description: `${headline}. ${PROTEIN_COFFEE.servingNote}.`,
        },
        status: 'published',
        featured: true,
        order: 0,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Protein coffee product upserted (1 record).');
}

async function seedLoadedTeaProducts(
  categoryIds: Record<string, Types.ObjectId>,
  addInOptions: Array<{ addInId: Types.ObjectId; maxQuantity: number; included: boolean }>
): Promise<void> {
  const legacySlugs = LOADED_TEAS_MENU.items.map((item) => `loaded-tea-${item.slug}`);

  await Product.updateMany(
    { slug: { $in: legacySlugs } },
    { $set: { status: 'archived' } }
  );

  const { heroImage, headline } = LOADED_TEAS_MENU;

  await Product.findOneAndUpdate(
    { slug: LOADED_TEA_PRODUCT_SLUG },
    {
      $set: {
        slug: LOADED_TEA_PRODUCT_SLUG,
        sku: 'FFB-LTEA-MAIN',
        name: loc(headline),
        shortDescription: loc(loadedTeaProductShortDescription()),
        description: rich(loadedTeaProductDescriptionHtml()),
        productType: 'single',
        categoryId: categoryIds['mega-teas'],
        images: [img(heroImage.url, heroImage.alt)],
        basePrice: loadedTeaSizePriceCents('32oz'),
        variants: [
          {
            sku: 'FFB-LTEA-24',
            name: loc('24 oz'),
            price: loadedTeaSizePriceCents('24oz'),
            inventory: 0,
          },
          {
            sku: 'FFB-LTEA-32',
            name: loc('32 oz'),
            price: loadedTeaSizePriceCents('32oz'),
            inventory: 0,
          },
          {
            sku: 'FFB-LTEA-P24',
            name: loc('24 oz'),
            price: loadedTeaSizePriceCents('24oz', 'mango-breeze'),
            inventory: 0,
          },
          {
            sku: 'FFB-LTEA-P32',
            name: loc('32 oz'),
            price: loadedTeaSizePriceCents('32oz', 'mango-breeze'),
            inventory: 0,
          },
        ],
        flavorIds: [],
        kitSizes: [],
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
          title: `${headline} | ${BRAND.name}`,
          description: loadedTeaProductShortDescription(),
        },
        status: 'published',
        featured: true,
        order: 0,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Product.updateOne({ slug: 'signature-mega-tea' }, { $set: { status: 'archived' } });

  console.log('Loaded tea product upserted (1 record).');
}

async function seedAcaiBowlProducts(
  categoryIds: Record<string, Types.ObjectId>,
  addInIds: Record<string, Types.ObjectId>
): Promise<void> {
  const activeSlugs = ACAI_BOWLS_MENU.items.map((item) => `acai-bowl-${item.slug}`);
  const acaiExtraAddInOptions = acaiBowlExtraAddInSlugs()
    .map((slug) => addInIds[slug])
    .filter(Boolean)
    .map((addInId) => ({
      addInId,
      maxQuantity: 1,
      included: false,
    }));

  const acaiBowlSkuBySlug: Record<string, string> = {
    'dubai-acai-bowl': 'FFB-ACAI-DUBAI',
    'regular-acai-bowl': 'FFB-ACAI-REG',
    'protein-bowl-crunchy-monkey': 'FFB-ACAI-CRUNCHY',
    'tropical-acai-bowl': 'FFB-ACAI-TROP',
    'protein-bowl-berry': 'FFB-ACAI-BERRY',
  };

  await Product.updateOne(
    { slug: 'tropical-acai-bowl' },
    { $set: { status: 'archived', sku: 'FFB-ACAI-001-ARCHIVED' } }
  );
  await Product.updateOne(
    { slug: 'acai-bowl-tropical-bowl' },
    { $set: { status: 'archived', sku: 'FFB-ACAI-TROP-ARCHIVED' } }
  );
  await Product.updateOne(
    { slug: 'acai-bowl-protein-bowl-tropical' },
    { $set: { status: 'archived', sku: 'FFB-ACAI-TROP-PROT-ARCHIVED' } }
  );

  for (const [index, item] of ACAI_BOWLS_MENU.items.entries()) {
    const sku = acaiBowlSkuBySlug[item.slug] ?? `FFB-ACAI-${String(index + 1).padStart(3, '0')}`;
    const slug = `acai-bowl-${item.slug}`;

    await Product.findOneAndUpdate(
      { slug },
      {
        $set: {
          slug,
          sku,
          name: loc(item.name),
          shortDescription: loc(acaiBowlShortDescription(item)),
          description: rich(acaiBowlDescriptionHtml(item)),
          productType: 'single',
          categoryId: categoryIds['acai-bowls'],
          images:
            'placeholder' in item && item.placeholder
              ? []
              : menuItemImage(item, item.name),
          basePrice: acaiBowlPriceCents(item),
          variants:
            'size' in item && item.size
              ? [
                  {
                    sku: `${sku}-12OZ`,
                    name: loc(item.size),
                    price: acaiBowlPriceCents(item),
                    inventory: 0,
                  },
                ]
              : [],
          flavorIds: [],
          kitSizes: [],
          addInOptions: acaiExtraAddInOptions,
          inventory: {
            trackInventory: false,
            quantity: 0,
            lowStockThreshold: 5,
            allowBackorder: false,
          },
          allergens: [],
          dietaryTags: [],
          seo: {
            title: `${item.name} | ${BRAND.name}`,
            description: `${item.name}. ${item.description}`,
          },
          status: 'published',
          featured: index === 0,
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const staleAcaiBowls = await Product.find({
    categoryId: categoryIds['acai-bowls'],
    slug: { $nin: [...activeSlugs, 'tropical-acai-bowl', 'acai-bowl-tropical-bowl', 'acai-bowl-protein-bowl-tropical'] },
    status: 'published',
  }).select('slug');

  for (const stale of staleAcaiBowls) {
    await Product.updateOne({ _id: stale._id }, { $set: { status: 'archived' } });
  }

  console.log(`Açaí bowl products upserted (${ACAI_BOWLS_MENU.items.length} records).`);
}

async function seedWaffleProducts(
  categoryIds: Record<string, Types.ObjectId>,
  addInIds: Record<string, Types.ObjectId>
): Promise<void> {
  const activeSlugs = WAFFLES_MENU.items.map((item) => `waffle-${item.slug}`);
  const waffleExtraAddInOptions = waffleExtraAddInSlugs()
    .map((slug) => addInIds[slug])
    .filter(Boolean)
    .map((addInId) => ({
      addInId,
      maxQuantity: 1,
      included: false,
    }));

  await Product.updateOne(
    { slug: 'fusion-waffle' },
    { $set: { status: 'archived', sku: 'FFB-WAFL-001-ARCHIVED' } }
  );

  for (const [index, item] of WAFFLES_MENU.items.entries()) {
    const sku = `FFB-WAFL-${String(index + 1).padStart(3, '0')}`;
    const slug = `waffle-${item.slug}`;

    await Product.findOneAndUpdate(
      { slug },
      {
        $set: {
          slug,
          sku,
          name: loc(item.name),
          shortDescription: loc(waffleShortDescription(item)),
          description: rich(waffleDescriptionHtml(item)),
          productType: 'single',
          categoryId: categoryIds['waffles'],
          images: menuItemImage(item, item.name),
          basePrice: wafflePriceCents(),
          variants: [
            {
              sku: `${sku}-STD`,
              name: loc('Standard'),
              price: wafflePriceCents(),
              inventory: 0,
            },
          ],
          flavorIds: [],
          kitSizes: [],
          addInOptions: waffleExtraAddInOptions,
          inventory: {
            trackInventory: false,
            quantity: 0,
            lowStockThreshold: 5,
            allowBackorder: false,
          },
          allergens: [],
          dietaryTags: [],
          seo: {
            title: `${item.name} | ${BRAND.name}`,
            description: `${item.name} protein waffle. ${WAFFLES_MENU.websiteDescription}`,
          },
          status: 'published',
          featured: index === 0,
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const staleWaffles = await Product.find({
    categoryId: categoryIds['waffles'],
    slug: { $nin: [...activeSlugs, 'fusion-waffle'] },
    status: 'published',
  }).select('slug');

  for (const stale of staleWaffles) {
    await Product.updateOne({ _id: stale._id }, { $set: { status: 'archived' } });
  }

  console.log(`Waffle products upserted (${WAFFLES_MENU.items.length} records).`);
}

async function seedProteinShakeProducts(
  categoryIds: Record<string, Types.ObjectId>,
  addInOptions: Array<{ addInId: Types.ObjectId; maxQuantity: number; included: boolean }>
): Promise<void> {
  const legacySlugs = PROTEIN_SHAKES_MENU.items.map((item) => proteinShakeProductSlug(item.slug));

  await Product.updateMany(
    { slug: { $in: legacySlugs } },
    { $set: { status: 'archived' } }
  );
  await Product.updateMany(
    { slug: 'chocolate-protein-shake' },
    { $set: { status: 'archived', sku: 'FFB-PSHK-LEGACY' } }
  );

  const { heroImage, headline } = PROTEIN_SHAKES_MENU;

  await Product.findOneAndUpdate(
    { slug: PROTEIN_SHAKE_PRODUCT_SLUG },
    {
      $set: {
        slug: PROTEIN_SHAKE_PRODUCT_SLUG,
        sku: 'FFB-PSHK-MAIN',
        name: loc(headline),
        shortDescription: loc(proteinShakeProductShortDescription()),
        description: rich(proteinShakeProductDescriptionHtml()),
        productType: 'single',
        categoryId: categoryIds['protein-shakes'],
        images: [img(heroImage.url, heroImage.alt)],
        basePrice: proteinShakeSizePriceCents('24oz'),
        variants: PROTEIN_SHAKES_MENU.sizes.map((size) => ({
          sku: `FFB-PSHK-${size.variantSuffix}`,
          name: loc(size.name),
          price: proteinShakeSizePriceCents(size.slug),
          inventory: 0,
        })),
        flavorIds: [],
        kitSizes: [],
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
          title: `${headline} | ${BRAND.name}`,
          description: proteinShakeProductShortDescription(),
        },
        status: 'published',
        featured: true,
        order: 0,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Protein shake product upserted (1 record).');
}

async function seedProteinTreatProducts(
  categoryIds: Record<string, Types.ObjectId>
): Promise<void> {
  const activeSlugs = PROTEIN_TREATS_MENU.items.map((item) => item.slug);
  const treatsWithoutAddOns = [
    PROTEIN_TREATS_MENU.proteinTruffles.slug,
    PROTEIN_TREATS_MENU.pieInACup.slug,
  ];

  await Product.updateMany(
    { slug: { $in: [...activeSlugs, ...treatsWithoutAddOns] } },
    { $set: { addInOptions: [] } }
  );

  await Product.updateMany(
    { slug: 'protein-energy-bite' },
    { $set: { status: 'archived', sku: 'FFB-TRET-001-ARCHIVED' } }
  );
  await Product.updateMany(
    { slug: { $in: ['oreo-pie-in-a-cup', 'pie-in-a-cup-oreo'] } },
    { $set: { status: 'archived' } }
  );

  for (const [index, item] of PROTEIN_TREATS_MENU.items.entries()) {
    const sku = `FFB-TRET-${String(index + 1).padStart(3, '0')}`;
    const conflicts = await Product.find({ sku, slug: { $ne: item.slug } }).select('_id slug');
    for (const conflict of conflicts) {
      await Product.updateOne(
        { _id: conflict._id },
        { $set: { status: 'archived', sku: `${sku}-ARCHIVED-${conflict.slug}` } }
      );
    }
  }

  for (const [index, item] of PROTEIN_TREATS_MENU.items.entries()) {
    const sku = `FFB-TRET-${String(index + 1).padStart(3, '0')}`;
    const image =
      item.kind === 'protein-truffles'
        ? PROTEIN_TREATS_MENU.proteinTruffles.image
        : item.kind === 'protein-mini-donuts'
          ? PROTEIN_TREATS_MENU.proteinMiniDonuts.image
          : PROTEIN_TREATS_MENU.pieInACup.image;
    const productImages =
      item.kind === 'pie-in-a-cup'
        ? proteinTreatPieImages().map((entry) => img(entry.url, entry.alt))
        : [img(image.url, image.alt)];

    await Product.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          slug: item.slug,
          sku,
          name: loc(item.name),
          shortDescription: loc(proteinTreatShortDescription(item)),
          description: rich(proteinTreatDescriptionHtml(item)),
          productType: 'single',
          categoryId: categoryIds['protein-treats'],
          images: productImages,
          basePrice: proteinTreatItemPriceCents(item),
          variants: proteinTreatItemVariants(item, sku).map((variant) => ({
            sku: variant.sku,
            name: loc(variant.name.en),
            price: variant.price,
            inventory: variant.inventory,
          })),
          flavorIds: [],
          kitSizes: [],
          addInOptions: [],
          inventory: {
            trackInventory: false,
            quantity: 0,
            lowStockThreshold: 5,
            allowBackorder: false,
          },
          allergens: [],
          dietaryTags: [],
          seo: {
            title: `${item.name} | ${BRAND.name}`,
            description: `${item.name} — ${proteinTreatShortDescription(item)}`,
          },
          status: 'published',
          featured: index === 0,
          order: index,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const staleTreats = await Product.find({
    categoryId: categoryIds['protein-treats'],
    slug: { $nin: activeSlugs },
    status: 'published',
  }).select('slug');

  for (const stale of staleTreats) {
    await Product.updateOne({ _id: stale._id }, { $set: { status: 'archived' } });
  }

  console.log(`Protein treat products upserted (${PROTEIN_TREATS_MENU.items.length} records).`);
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
        'Mega Tea Kit add-ons include Lift Off, Aloe Vera, NRG or Tea, Collagen, and Flavor Enhancer — $10.00 each.',
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
  const loadedTeaAddInOptions = loadedTeaOptionalAddInSlugs()
    .filter((slug) => addInIds[slug])
    .map((slug) => ({
      addInId: addInIds[slug],
      maxQuantity: slug === 'ltea-fat-reducing-shot' ? 1 : 5,
      included: false,
    }));
  const megaTeaKitAddInOptions = megaTeaKitOptionalAddInSlugs()
    .filter((slug) => addInIds[slug])
    .map((slug) => ({
      addInId: addInIds[slug],
      maxQuantity: 5,
      included: false,
    }));
  const proteinCoffeeAddInOptions = proteinCoffeeOptionalAddInSlugs()
    .filter((slug) => addInIds[slug])
    .map((slug) => ({
      addInId: addInIds[slug],
      maxQuantity: 5,
      included: false,
    }));

  const proteinShakeAddInOptions = proteinShakeOptionalAddInSlugs()
    .filter((slug) => addInIds[slug])
    .map((slug) => ({
      addInId: addInIds[slug],
      maxQuantity: slug === 'pshk-fat-reducing-shot' ? 1 : 5,
      included: false,
    }));

  await seedServices();
  await seedProducts(categoryIds, flavorIds, addInIds);
  await seedMegaTeaKitProducts(categoryIds, flavorIds, megaTeaKitAddInOptions);
  await seedProteinCoffeeProducts(categoryIds, proteinCoffeeAddInOptions);
  await seedLoadedTeaProducts(categoryIds, loadedTeaAddInOptions);
  await seedAcaiBowlProducts(categoryIds, addInIds);
  await seedWaffleProducts(categoryIds, addInIds);
  await seedProteinShakeProducts(categoryIds, proteinShakeAddInOptions);
  await seedProteinTreatProducts(categoryIds);
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
