import 'server-only';

import connectDB from '@/lib/mongodb';
import TranslationOverride from '@/models/TranslationOverride';

export type TranslationLocale = 'en' | 'es';

const CACHE_TTL_MS = 30_000;
const cache = new Map<TranslationLocale, { at: number; value: Record<string, string> }>();

export function flattenKeys(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (value && typeof value === 'object') {
      Object.assign(result, flattenKeys(value as Record<string, unknown>, fullKey));
    }
  }
  return result;
}

export function applyOverrides<T extends Record<string, unknown>>(base: T, overrides: Record<string, string>): T {
  const result = JSON.parse(JSON.stringify(base)) as Record<string, unknown>;
  for (const [key, value] of Object.entries(overrides)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const next = current[parts[i]];
      if (!next || typeof next !== 'object') {
        current[parts[i]] = {};
      }
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result as T;
}

/** Overrides saved by admins. Never throws: the site must render even if the DB is unreachable. */
export async function getTranslationOverrides(locale: TranslationLocale): Promise<Record<string, string>> {
  const hit = cache.get(locale);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.value;
  }
  try {
    await connectDB();
    const doc = await TranslationOverride.findOne({ locale }).lean();
    const value: Record<string, string> = {};
    for (const item of doc?.overrides ?? []) value[item.key] = item.value;
    cache.set(locale, { at: Date.now(), value });
    return value;
  } catch (error) {
    console.error('Translation overrides unavailable', error);
    return hit?.value ?? {};
  }
}

export async function saveTranslationOverrides(
  locale: TranslationLocale,
  updates: Record<string, string>
): Promise<void> {
  await connectDB();
  const existing = await TranslationOverride.findOne({ locale }).lean();
  const merged: Record<string, string> = {};
  for (const item of existing?.overrides ?? []) merged[item.key] = item.value;
  Object.assign(merged, updates);
  const overrides = Object.entries(merged).map(([key, value]) => ({ key, value }));
  await TranslationOverride.updateOne({ locale }, { $set: { overrides } }, { upsert: true });
  cache.delete(locale);
}
