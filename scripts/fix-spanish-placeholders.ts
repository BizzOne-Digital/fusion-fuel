/**
 * Replaces legacy `[ES - Review Required]` Spanish fields in MongoDB with English copy
 * (or strips the placeholder prefix). Run after deploying getLocalized fixes.
 *
 * Usage: node node_modules/tsx/dist/cli.cjs scripts/fix-spanish-placeholders.ts
 */
import './load-env';
import mongoose from 'mongoose';
import { SPANISH_REVIEW_PLACEHOLDER, isSpanishContentPlaceholder } from '../src/lib/locale-placeholders';
import { richTextToPlainText } from '../src/lib/utils';

function fixLocalizedField(value: unknown): { changed: boolean; value: unknown } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { changed: false, value };
  }
  const record = value as { en?: string; es?: string };
  if (typeof record.en !== 'string' && typeof record.es !== 'string') {
    return { changed: false, value };
  }
  const en = typeof record.en === 'string' ? record.en : '';
  let es = typeof record.es === 'string' ? record.es : '';
  if (!isSpanishContentPlaceholder(es)) {
    return { changed: false, value };
  }
  if (es.startsWith(SPANISH_REVIEW_PLACEHOLDER)) {
    const remainder = es.slice(SPANISH_REVIEW_PLACEHOLDER.length).trim();
    es = remainder || en;
  } else {
    es = en;
  }
  es = richTextToPlainText(es);
  const fixedEn = richTextToPlainText(en);
  return { changed: true, value: { en: fixedEn, es } };
}

function deepFixLocalized(doc: Record<string, unknown>): boolean {
  let changed = false;
  for (const [key, val] of Object.entries(doc)) {
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      if ('en' in (val as object) && 'es' in (val as object)) {
        const result = fixLocalizedField(val);
        if (result.changed) {
          doc[key] = result.value as never;
          changed = true;
        }
      } else if (!((val as { _bsontype?: string })._bsontype === 'ObjectID')) {
        changed = deepFixLocalized(val as Record<string, unknown>) || changed;
      }
    }
  }
  return changed;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing in .env.local');

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');

  const collections = await db.listCollections().toArray();
  let totalUpdated = 0;

  for (const { name } of collections) {
    const col = db.collection(name);
    const cursor = col.find({});
    for await (const doc of cursor) {
      const plain = { ...doc } as Record<string, unknown>;
      delete plain._id;
      const clone = JSON.parse(JSON.stringify(plain)) as Record<string, unknown>;
      if (!deepFixLocalized(clone)) continue;
      await col.updateOne({ _id: doc._id }, { $set: clone });
      totalUpdated += 1;
    }
  }

  console.log(`Updated ${totalUpdated} documents with Spanish placeholder content.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
