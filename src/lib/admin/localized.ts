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
