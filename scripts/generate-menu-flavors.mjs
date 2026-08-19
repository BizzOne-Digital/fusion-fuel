import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FLAVOR_COLLECTIONS = [
  {
    slug: 'signature-favourites',
    name: 'Signature Favourites',
    description: 'Mega Tea classics from the Signature Favorites menu (posters 1–3).',
  },
  {
    slug: 'new-flavour-collection',
    name: 'New Flavour Collection',
    description: 'Latest loaded tea blends from the New Flavor Collection menu (posters 4–7).',
  },
  {
    slug: 'fall-citrus-collection',
    name: 'Fall Citrus Collection',
    description: 'Bright citrus seasonal blends (menu poster 1).',
  },
  {
    slug: 'fall-berry-collection',
    name: 'Fall Berry Collection',
    description: 'Seasonal berry-forward blends (menu posters 2 & 4).',
  },
  {
    slug: 'school-fun-collection',
    name: 'School Fun Collection',
    description: 'Playful school-inspired blends (menu poster 3).',
  },
];

/** Client batch-2 poster index (1–4) → collection slug. */
const SEASONAL_POSTER_MAP = [
  { imageIndex: 1, collection: 'fall-citrus-collection' },
  { imageIndex: 2, collection: 'fall-berry-collection' },
  { imageIndex: 3, collection: 'school-fun-collection' },
  { imageIndex: 4, collection: 'fall-berry-collection' },
];

const signatureFavourites = [
  ['Citrus Watermelon Surge', ['Lemon-lime', 'Lemon', 'Mandarin', 'Watermelon', 'Lime']],
  ['Raspberry Pineapple Spark', ['Lemon-lime', 'Raspberry', 'Cranberry', 'Watermelon', 'Pineapple']],
  ['Ruby Raspberry Wave', ['Pomegranate', 'Raspberry', 'Cranberry', 'Watermelon']],
  ['Green Apple Mango Splash', ['Lemon-lime', 'Lemon', 'Mango', 'Watermelon', 'Green apple']],
  ['Rainbow Watermelon Carnival', ['Tropical fruit', 'Mandarin', 'Watermelon', 'Rainbow candy']],
  ['Sunshine Strawberry Splash', ['Tropical Liftoff', 'Lemon Tea', 'Lemon', 'Strawberry']],
  ['Pink Colada Cruiser', ['Orange Liftoff', 'Lemon Tea', 'Pink candy', 'Pina colada']],
  ['Mango Hibiscus Sunset', ['Pomegranate', 'Passionfruit hibiscus', 'Mango', 'Watermelon', 'Lime']],
  ['Cherry Watermelon Rush', ['Pomegranate', 'Lemon', 'Cranberry', 'Watermelon', 'Cherry']],
  ['Strawberry Hibiscus Glow', ['Tropical fruit', 'Passionfruit hibiscus', 'Cranberry', 'Watermelon', 'Strawberry']],
  ['Pineapple Passion Sunset', ['Pineapple', 'Passionfruit hibiscus', 'Mango', 'Watermelon']],
  ['Witches Whip', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Grape Aloe', 'Green apple', 'Grape', 'Blue Blast']],
  ['Cherry Cotton Candy Buzz', ['Tropical Liftoff', 'Raspberry Tea', 'Cherry limeade', 'Cotton candy']],
  ['Blue Citrus Breeze', ['Orange Liftoff', 'Peach Tea', 'Blue raspberry citrus', 'Orange']],
  ['Pink Lime Spark', ['Lime Liftoff', 'Raspberry Tea', 'Pink lemonade']],
  ['Raspberry Citrus Rush', ['Pomegranate Liftoff', 'Raspberry Tea', 'Orange', 'Raspberry']],
  ['Blueberry Boardwalk Splash', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Strawberry-watermelon', 'Blue raspberry', 'Strawberry lemonade', 'Mango Aloe']],
  ['Cherry Watermelon Crush', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Cherry', 'Strawberry-watermelon']],
  ['Blackberry Grape Melon', ['Pomegranate Berry Liftoff', 'Peach Tea', 'Blackberry', 'Strawberry-watermelon', 'Grape Aloe']],
  ['Orange Pineapple Paradise', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Strawberry-watermelon', 'Orange-pineapple', 'Mango Aloe']],
  ['Watermelon Lemonade Lift', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Strawberry-watermelon', 'Strawberry lemonade collagen', 'Cranberry Aloe']],
  ['Melon Berry Glow', ['Lime Liftoff', 'Peach Tea', 'Watermelon', 'Strawberry']],
  ['Rainbow Grape Pop', ['Pomegranate Liftoff', 'Peach Tea', 'Rainbow candy', 'Grape']],
  ['Electric Watermelon Wave', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Blue Blast', 'Strawberry-watermelon']],
  ['Tropical Pineapple Melon', ['Orange Liftoff', 'Peach Tea', 'Orange-pineapple', 'Strawberry-watermelon', 'Tropical fruit']],
  ['Strawberry Lemonade Glow', ['Lemon-Lime Liftoff', 'Peach Tea', 'Strawberry', 'Strawberry-watermelon', 'Strawberry lemonade collagen']],
  ['Rainbow Candy Splash', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Rainbow candy', 'Strawberry-watermelon']],
  ['Blackberry Watermelon Burst', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Strawberry-watermelon', 'Blackberry']],
  ['Island Cherry Punch', ['Orange Liftoff', 'Peach Tea', 'Strawberry-watermelon', 'Orange-pineapple', 'Cherry']],
  ['Kiwi Mango Splash', ['Pineapple Liftoff', 'Strawberry kiwi', 'Mango', 'Mango Aloe']],
  ['Coconut Strawberry Breeze', ['Pineapple Liftoff', 'Strawberry', 'Coconut', 'Pineapple']],
  ['Mango Melon Express', ['Pineapple Liftoff', 'Mango', 'Melon', 'Mango Aloe']],
  ['Color Burst', ['Orange Liftoff', 'Mango Aloe', 'Cherry', 'Grape']],
];

const newFlavourCollection = [
  ['Cherry Citrus Chill', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Cherry', 'Limeade', 'Cranberry Aloe']],
  ['Tropical Mango Punch', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Orange-pineapple', 'Mango Aloe']],
  ['Cotton Candy Berry Pop', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Rainbow candy', 'Strawberry']],
  ['Strawberry Lemon Glow', ['Lemon-Lime Liftoff', 'Peach Tea', 'Strawberry', 'Strawberry lemonade collagen', 'Cranberry Aloe']],
  ['Blackberry Lemon Beauty', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Blackberry', 'Strawberry lemonade collagen', 'Wild Berry Mix']],
  ['Cherry Paradise Splash', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Cherry', 'Strawberry']],
  ['Watermelon Lime Candy', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Strawberry-watermelon', 'Limeade']],
  ['Blueberry Grape Lagoon', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Blue Blast', 'Blackberry', 'Grape Aloe']],
  ['Strawberry Sunrise Crush', ['Orange Liftoff', 'Peach Tea', 'Strawberry', 'Orange-pineapple', 'Peach Mango Mix']],
  ['Blue Raspberry Voltage', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Blue raspberry', 'Blue Blast']],
  ['Pink Citrus Kiss', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Strawberry', 'Limeade', 'Strawberry lemonade collagen']],
  ['Purple Grape Storm', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Blackberry', 'Blue Blast', 'Grape Aloe']],
  ['Strawberry Island Punch', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Strawberry', 'Orange-pineapple', 'Mango Aloe']],
  ['Tropical Melon Sunrise', ['Orange Liftoff', 'Peach Tea', 'Strawberry-watermelon', 'Tropical fruit', 'Mango Aloe']],
  ['Ocean Berry Breeze', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Blue Blast', 'Tropical fruit', 'Mango Aloe']],
  ['Rainbow Lime Shock', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Rainbow candy', 'Limeade']],
  ['Berry Sunset Glow', ['Orange Liftoff', 'Raspberry Tea', 'Strawberry', 'Blackberry', 'Cranberry Aloe']],
  ['Clean Citrus Green', ['Lemon-Lime Liftoff', 'Peach Tea', 'Limeade', 'Cranberry Aloe']],
  ['Raspberry Grape Hydration', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Limeade', 'Grape Aloe']],
  ['Wild Berry Cheesecake', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Wild Berry Mix', 'Strawberry lemonade collagen']],
  ['Cherry Cola Spark', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Cherry', 'Limeade']],
  ['Coral Strawberry Reef', ['Pomegranate Berry Liftoff', 'Peach Tea', 'Tropical fruit', 'Strawberry', 'Grape Aloe']],
  ['Tart Blueberry Twist', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Blue raspberry', 'Limeade']],
  ['Peach Tropical Lime', ['Lemon-Lime Liftoff', 'Peach Tea', 'Tropical fruit', 'Limeade', 'Mango Aloe']],
  ['Orange Lime Cooler', ['Orange Liftoff', 'Peach Tea', 'Limeade', 'Mango Aloe']],
  ['Strawberry Shortcake Splash', ['Orange Liftoff', 'Peach Tea', 'Strawberry', 'Peach Mango Mix', 'Strawberry lemonade collagen']],
  ['Fruity Rainbow Pebbles', ['Lemon-Lime Liftoff', 'Peach Tea', 'Rainbow candy', 'Strawberry lemonade collagen']],
  ['Grape Blue Fizz', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Grape', 'Blue Blast', 'Grape Aloe']],
  ['Citrus Pineapple Twist', ['Lemon-Lime Liftoff', 'Peach Tea', 'Orange-pineapple', 'Limeade', 'Mango Aloe']],
  ['Sweet Tart Galaxy', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Rainbow candy', 'Blue Blast']],
  ['Galaxy Berry Storm', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Blue raspberry', 'Blue Blast', 'Blackberry']],
  ['Hawaiian Melon Punch', ['Orange Liftoff', 'Peach Tea', 'Strawberry-watermelon', 'Tropical fruit', 'Cherry']],
  ['Black Cherry Bomb', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Cherry', 'Blackberry']],
  ['Citrus Cherry Fizz', ['Orange Liftoff', 'Peach Tea', 'Orange-pineapple', 'Cherry', 'Cranberry Aloe']],
  ['Watermelon Mango Magic', ['Lemon-Lime Liftoff', 'Peach Tea', 'Strawberry-watermelon', 'Mango Aloe']],
  ['Tropical Blueberry Boost', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Blue Blast', 'Wild Berry Mix']],
  ['Peach Berry Lime Fizz', ['Orange Liftoff', 'Peach Tea', 'Strawberry', 'Limeade', 'Peach Mango Mix']],
  ['Cherry Strawberry Punch', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Cherry', 'Strawberry', 'Wild Berry Mix']],
  ['Caribbean Cherry Dream', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Cherry', 'Peach Mango Mix']],
  ['Mango Blue Splash', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Blue Blast', 'Peach Mango Mix']],
  ['Pink Panther Punch', ['Orange Liftoff', 'Peach Tea', 'Strawberry', 'Cherry', 'Strawberry lemonade collagen']],
  ['Wild Berry Wave', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Blue raspberry', 'Strawberry', 'Wild Berry Mix']],
  ['Sunset Cherry Melon', ['Orange Liftoff', 'Peach Tea', 'Strawberry-watermelon', 'Cherry', 'Peach Mango Mix']],
  ['Wild Island Berry', ['Orange Liftoff', 'Peach Tea', 'Tropical fruit', 'Blue raspberry', 'Wild Berry Mix']],
  ['Berry Sunrise Spark', ['Orange Liftoff', 'Peach Tea', 'Strawberry', 'Orange-pineapple', 'Wild Berry Mix']],
  ['Berry Candy Crush', ['Lemon-Lime Liftoff', 'Raspberry Tea', 'Rainbow candy', 'Blue raspberry', 'Wild Berry Mix']],
  ['Ultimate Berry Fusion', ['Pomegranate Berry Liftoff', 'Raspberry Tea', 'Strawberry', 'Blackberry', 'Wild Berry Mix']],
];

// Batch 2 menu posters — add flavor rows when client confirms list from each image.
const fallCitrusCollection = [];
const fallBerryCollection = [];
const schoolFunCollection = [];

const COLORS = ['#E8F000', '#FF3F72', '#FFE500', '#CDDC39', '#FF4081', '#A4C639'];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function pack(collection, rows, startIndex = 0) {
  return rows.map(([name, ingredients], i) => ({
    slug: slugify(name),
    name,
    collection,
    color: COLORS[(startIndex + i) % COLORS.length],
    isNew: collection === 'new-flavour-collection',
    ingredients,
  }));
}

const MENU_FLAVORS = [
  ...pack('signature-favourites', signatureFavourites),
  ...pack('new-flavour-collection', newFlavourCollection, signatureFavourites.length),
  ...pack('fall-citrus-collection', fallCitrusCollection, signatureFavourites.length + newFlavourCollection.length),
  ...pack(
    'fall-berry-collection',
    fallBerryCollection,
    signatureFavourites.length + newFlavourCollection.length + fallCitrusCollection.length
  ),
  ...pack(
    'school-fun-collection',
    schoolFunCollection,
    signatureFavourites.length +
      newFlavourCollection.length +
      fallCitrusCollection.length +
      fallBerryCollection.length
  ),
];

const slugs = MENU_FLAVORS.map((f) => f.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) {
  throw new Error(`Duplicate slugs: ${[...new Set(dupes)].join(', ')}`);
}

const lines = [];
lines.push('/** Mega Tea menu flavors sourced from client menu posters. */');
lines.push('');
lines.push('export const FLAVOR_COLLECTIONS = [');
for (const c of FLAVOR_COLLECTIONS) {
  lines.push(`  {`);
  lines.push(`    slug: '${c.slug}',`);
  lines.push(`    name: '${c.name}',`);
  lines.push(`    description: '${c.description}',`);
  lines.push(`  },`);
}
lines.push('] as const;');
lines.push('');
lines.push('/** Client batch-2 poster index (1–4) → collection. */');
lines.push('export const SEASONAL_POSTER_MAP = [');
for (const entry of SEASONAL_POSTER_MAP) {
  lines.push(`  { imageIndex: ${entry.imageIndex}, collection: '${entry.collection}' },`);
}
lines.push('] as const;');
lines.push('');
lines.push('export type FlavorCollectionSlug = (typeof FLAVOR_COLLECTIONS)[number][\'slug\'];');
lines.push('');
lines.push('export interface MenuFlavor {');
lines.push('  slug: string;');
lines.push('  name: string;');
lines.push('  collection: FlavorCollectionSlug;');
lines.push('  color: string;');
lines.push('  isNew: boolean;');
lines.push('  ingredients: readonly string[];');
lines.push('}');
lines.push('');
lines.push('export const MENU_FLAVORS: readonly MenuFlavor[] = [');
for (const f of MENU_FLAVORS) {
  const ing = f.ingredients.map((i) => `'${i.replace(/'/g, "\\'")}'`).join(', ');
  lines.push('  {');
  lines.push(`    slug: '${f.slug}',`);
  lines.push(`    name: '${f.name.replace(/'/g, "\\'")}',`);
  lines.push(`    collection: '${f.collection}',`);
  lines.push(`    color: '${f.color}',`);
  lines.push(`    isNew: ${f.isNew},`);
  lines.push(`    ingredients: [${ing}],`);
  lines.push('  },');
}
lines.push('] as const;');
lines.push('');
lines.push('export function getCollectionLabel(slug: FlavorCollectionSlug): string {');
lines.push('  return FLAVOR_COLLECTIONS.find((c) => c.slug === slug)?.name ?? slug;');
lines.push('}');
lines.push('');

const outPath = join(__dirname, '../src/lib/menu-flavors.ts');
writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Wrote ${MENU_FLAVORS.length} flavors to ${outPath}`);
