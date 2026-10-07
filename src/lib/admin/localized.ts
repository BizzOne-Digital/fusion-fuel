import { richTextToPlainText } from '@/lib/utils';

export interface LocalizedText {
  en: string;
  es: string;
}

/** Ensures both locales are present for API validation (ES falls back to EN). */
export function normalizeLocalized(value: LocalizedText): LocalizedText {
  const en = value.en.trim();
  const es = value.es.trim() || en;
  return { en, es };
}

/** Strip HTML tags from localized rich text before save or display in admin. */
export function localizedPlainText(value: LocalizedText): LocalizedText {
  return {
    en: richTextToPlainText(value.en),
    es: richTextToPlainText(value.es),
  };
}

export function normalizeLocalizedPlain(value: LocalizedText): LocalizedText {
  return normalizeLocalized(localizedPlainText(value));
}
