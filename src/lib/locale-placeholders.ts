/** Legacy seed placeholder — never show on the Spanish storefront. */
export const SPANISH_REVIEW_PLACEHOLDER = '[ES - Review Required]';

export function isSpanishContentPlaceholder(value: string | undefined | null): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed === SPANISH_REVIEW_PLACEHOLDER) return true;
  if (trimmed.startsWith(SPANISH_REVIEW_PLACEHOLDER)) return true;
  return false;
}
