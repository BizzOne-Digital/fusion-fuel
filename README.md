# Fusion Fuel & Boost Co.

Production-ready Next.js eCommerce platform with catering bookings, customer portal, multilingual CMS, and admin portal for **Fusion Fuel & Boost Co.**

**Headline:** FUEL YOUR DAY. BOOST YOUR LIFE.

---

## What Was Built

- Public website with English/Spanish locale routing (`/[locale]/...`)
- Online store architecture (products, cart, checkout, Stripe webhooks)
- Mega Tea Kit builder with flavors, serving sizes, and add-ins
- Catering booking request flow
- Customer account portal (orders, bookings, profile)
- Full admin CMS (`/admin/*`) with CRUD for pages, products, services, orders, and more
- MongoDB data layer with Mongoose models
- CRM-ready integration layer (disabled by default)
- SMTP email architecture
- SEO: sitemap, robots, structured metadata hooks

---

## Installation

### Prerequisites

- **Node.js** 20+ recommended
- **MongoDB** 6+ (local install or MongoDB Atlas)
- **npm** (or compatible package manager)

### Setup

```bash
# Clone and enter the project
cd katerie

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values (see Environment Variables below)

# Seed the database
npm run seed

# Start development server
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en).

### Verify

```bash
npm run typecheck
npm run lint
npm run build
```

---

## MongoDB Setup

### Local MongoDB

Default connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/fusion-fuel-boost
```

Database name: `fusion-fuel-boost`

Start MongoDB locally (varies by OS):

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Windows (if installed as a service)
net start MongoDB
```

### MongoDB Compass Connection

1. Open [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect with:

   ```text
   mongodb://127.0.0.1:27017
   ```

3. Select database: `fusion-fuel-boost`
4. Collections are created automatically when you run `npm run seed`

---

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `AUTH_SECRET` | Yes (production) | Random string for Auth.js session encryption. Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Yes (seed) | Initial admin login email |
| `ADMIN_PASSWORD` | Yes (seed) | Initial admin login password (hashed with bcrypt on seed) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL (e.g. `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | Checkout | Stripe secret key (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Checkout | Stripe publishable key (`pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Checkout | Stripe webhook signing secret (`whsec_...`) |
| `SMTP_HOST` | Email | SMTP server hostname |
| `SMTP_PORT` | Email | SMTP port (default `587`) |
| `SMTP_SECURE` | Email | `true` for TLS on port 465, else `false` |
| `SMTP_USER` | Email | SMTP username |
| `SMTP_PASS` | Email | SMTP password |
| `SMTP_FROM_NAME` | Email | Sender display name |
| `SMTP_FROM_EMAIL` | Email | Sender email address |
| `CONTACT_TO_EMAIL` | Email | Business inbox for contact/booking notifications |
| `CRM_PROVIDER` | Optional | `none` (default) or webhook provider |
| `CRM_WEBHOOK_URL` | Optional | Outbound CRM webhook URL |
| `CRM_WEBHOOK_SECRET` | Optional | HMAC secret for CRM webhook signing |
| `UPLOAD_MAX_SIZE_MB` | Optional | Max upload size in MB (default `5`) |

**Never commit `.env.local` or real credentials.**

---

## Seed Command

The seed script is **idempotent**—safe to rerun without duplicating records.

```bash
npm run seed
```

### What the seed creates

- Admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (bcrypt hash)
- Site settings singleton (business name, email, phone, Instagram, hours)
- 10 CMS pages (home, about, services, pricing, products, booking, testimonials, FAQs, contact)
- 10 product categories
- 7 catering services
- 22 sample flavors for kit builder demos
- 4 add-ins (collagen, hydration booster, aloe vera, extra flavor)
- Draft products with **no invented prices** (`basePrice: 0`, status `draft`)
- Mega Tea Kit builder with serving sizes 6 / 12 / 20 / 30 (prices set to 0)
- Compliance-safe FAQs
- Draft blog posts
- Gallery categories
- **Disabled** promotion templates (Buy 10 get 1 free, Free shipping)

### What the seed does NOT create

- Fake orders
- Genuine-looking customer reviews / testimonials
- Invented nutrition facts, addresses, shipping rates, or tax rates

Spanish content fields are seeded with `[ES - Review Required]` for professional translation review.

---

## Admin Setup

1. Set credentials in `.env.local`:

   ```env
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   AUTH_SECRET=your-random-secret
   ```

2. Run the seed:

   ```bash
   npm run seed
   ```

3. Start the app and sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

4. Change the admin password after first login in production.

---

## Stripe Test Mode

### 1. Create a Stripe account

Use [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) test mode keys.

### 2. Configure `.env.local`

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Test cards

Use Stripe test card numbers (e.g. `4242 4242 4242 4242`) with any future expiry and CVC.

### 4. Important behavior

- Orders are marked **paid** only after a **verified Stripe webhook**
- Browser redirect alone does not confirm payment
- Products with `basePrice: 0` (draft) cannot complete real checkout until prices are set in admin

If Stripe keys are missing, checkout surfaces a configuration message—it does not fake successful payment.

---

## Stripe CLI Webhook Testing

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward events to your local server:

```bash
# Login once
stripe login

# Forward webhooks to local API route
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret printed by the CLI into `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

Trigger a test event:

```bash
stripe trigger checkout.session.completed
```

Restart `npm run dev` after updating environment variables.

---

## SMTP Setup

Transactional emails (contact, booking, orders, password reset, verification) use Nodemailer.

Example (Gmail with app password—use a dedicated transactional provider in production):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=fusionfuelboostco@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Fusion Fuel & Boost Co
SMTP_FROM_EMAIL=fusionfuelboostco@gmail.com
CONTACT_TO_EMAIL=fusionfuelboostco@gmail.com
```

Emails include plain-text and HTML parts. SMTP credentials are server-only and never exposed to the client.

---

## Local Upload Limitations

Uploaded images are stored under:

```text
public/uploads/
public/uploads/pages/
public/uploads/products/
public/uploads/services/
public/uploads/gallery/
public/uploads/blog/
public/uploads/testimonials/
public/uploads/settings/
```

**Important:**

- Local filesystem storage requires a **persistent, writable** disk
- Serverless platforms with **ephemeral or read-only** filesystems will **not** safely preserve uploads across deploys
- For production, plan either persistent volume storage or migrate to external object storage in a future phase
- Brand photography lives in `/public/images/` (replace with client-supplied final photos when ready)

Upload validation includes MIME/extension checks, size limits, and path-traversal prevention.

---

## Translation Workflow

### UI strings (navigation, cart, checkout labels)

- Stored in `src/messages/en.json` and `src/messages/es.json`
- Managed as code/deploy artifacts

### Editable content (pages, products, services, FAQs, blog)

- Stored in MongoDB with `{ en, es }` fields
- Seed marks Spanish with `[ES - Review Required]`
- Admin portal provides en/es tabs for each content type
- Review and publish Spanish content before enabling for customers

Do not auto-machine-translate checkout-critical legal or pricing content without human review.

---

## Product and Price Management

1. Sign in to `/admin/products`
2. Open a draft product and set **real prices** in minor units (cents)
3. For Mega Tea Kits, configure **kit size prices** (6 / 12 / 20 / 30 servings)
4. Set add-in prices under `/admin/add-ins`
5. Add ingredients, allergens, caffeine, and nutrition only when verified
6. Change status from `draft` to `published` when ready

Until prices are configured, the storefront shows contact-for-pricing behavior and blocks paid checkout for zero-price items.

Use `/admin/pricing` for bulk price management, shipping, pickup, and currency settings.

---

## Promotion Configuration

Two **inactive templates** are seeded:

| Code | Type | Purpose |
|------|------|---------|
| `BUY10GET1` | Fixed amount (template) | Buy 10 Mega Tea kits, get 1 free |
| `FREESHIP` | Free shipping | Free shipping offer |

**Do not enable both simultaneously** without reviewing eligibility rules.

Configure in `/admin/promotions`:

- Start/end dates
- Minimum order amount
- Applicable products/categories
- Usage limits and per-customer limits
- Active status

Promotions are validated **server-side** and cannot produce negative order totals.

---

## CRM Integration Architecture

No CRM is connected by default (`CRM_PROVIDER=none`).

The integration layer provides:

- Provider-agnostic `CRMProvider` interface
- No-op default provider
- Optional signed outbound webhook provider
- Event hooks for: new customer, paid order, order status change, catering request, contact submission
- Non-blocking behavior—CRM failures do not cancel successful checkout

To enable webhook forwarding:

```env
CRM_PROVIDER=webhook
CRM_WEBHOOK_URL=https://your-crm-endpoint.example/hooks/fusion-fuel
CRM_WEBHOOK_SECRET=your-signing-secret
```

HubSpot or other CRMs can be added later without rewriting commerce logic.

---

## Production Deployment

### Recommended checklist

1. Set production environment variables on your host (Vercel, VPS, etc.)
2. Use MongoDB Atlas or a managed MongoDB instance
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Configure Stripe **live** keys and production webhook endpoint
5. Configure production SMTP
6. Set strong `AUTH_SECRET` and admin credentials
7. Run `npm run build && npm start` (or platform equivalent)
8. Ensure persistent storage for `public/uploads/` or migrate media strategy
9. Enable HTTPS everywhere
10. Point Stripe webhooks to `https://yourdomain.com/api/webhooks/stripe`

### Database and upload backups

**MongoDB**

- Enable automated backups (Atlas backup, `mongodump` cron, or provider snapshots)
- Test restore procedures regularly
- Export critical collections before major migrations

**Uploads**

- Back up `public/uploads/` alongside the database
- Media paths in MongoDB reference filesystem paths—restore both together
- Document orphan cleanup after media replacement in admin

---

## Completed Routes

### Public (`/[locale]/...`)

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/about` | About |
| `/services` | Services listing |
| `/services/[slug]` | Service detail |
| `/pricing` | Pricing |
| `/products` | Product catalog |
| `/products/[slug]` | Product detail / kit builder |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/checkout/success` | Order success |
| `/booking` | Catering request |
| `/blog` | Blog index |
| `/blog/[slug]` | Blog post |
| `/testimonials` | Testimonials |
| `/faqs` | FAQs |
| `/contact` | Contact |
| `/account/*` | Customer portal |

### Admin

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard |
| `/admin/pages` | Page CMS |
| `/admin/services` | Services CRUD |
| `/admin/products` | Products CRUD |
| `/admin/categories` | Categories |
| `/admin/flavors` | Flavor catalog |
| `/admin/add-ins` | Add-ins |
| `/admin/orders` | Orders |
| `/admin/bookings` | Catering requests |
| `/admin/customers` | Customers |
| `/admin/testimonials` | Testimonials |
| `/admin/faqs` | FAQs |
| `/admin/blog` | Blog |
| `/admin/pricing` | Pricing & shipping |
| `/admin/promotions` | Promotions |
| `/admin/translations` | Translation tools |
| `/admin/contact-submissions` | Contact inbox |
| `/admin/integrations` | CRM status |
| `/admin/settings` | Site settings |

### API

| Route | Description |
|-------|-------------|
| `/api/auth/[...nextauth]` | Auth.js handlers |
| `/api/webhooks/stripe` | Stripe webhooks |
| `/api/upload` | Admin image uploads |

---

## Architecture Summary

```text
Next.js App Router (React 19)
├── Public frontend ([locale] routes, next-intl)
├── Admin portal (/admin, Auth.js credentials)
├── API routes (auth, stripe webhooks, uploads)
├── Mongoose models → MongoDB
├── Stripe (checkout + webhook-verified orders)
├── Nodemailer (transactional email)
└── CRM layer (no-op / webhook provider)
```

Money is stored as **integer minor units** (USD cents). Images use `{ url, alt, width?, height? }`. Content uses `{ en, es }` locale fields.

---

## Content Still Required from Client

Before full production launch, the client should provide:

- [ ] Real product and kit prices
- [ ] Authentic product photography
- [ ] Verified ingredients and allergen lists
- [ ] Nutrition and caffeine information
- [ ] Shipping and pickup rules
- [ ] Tax configuration
- [ ] Exact promotion terms (choose Buy 10 get 1 **or** free shipping, not both without rules)
- [ ] Verified customer testimonials
- [ ] Confirmed business address and hours
- [ ] Catering packages and minimums
- [ ] Selected CRM provider (if any)
- [ ] Professional Spanish translations (replace `[ES - Review Required]`)
- [ ] Legal pages: privacy, terms, refund policies

---

## Business Contact (Seeded Defaults)

- **Email:** fusionfuelboostco@gmail.com
- **Phone:** 786-712-2133
- **Instagram:** [@pereira_katerine](https://www.instagram.com/pereira_katerine?igsh=cGNiajFwZzNndjly)

---

## License

Private client project. All rights reserved.
