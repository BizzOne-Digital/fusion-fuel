/** Matches the logo slogan gradient: lime “Fuel” line, pink “Boost” line. */
export const BRAND_SLOGAN_COLORS = {
  fuel: '#F5FF00',
  boost: '#FF4081',
} as const;

export function splitBrandSlogan(text: string): { fuel: string; boost: string } {
  const normalized = text.trim();
  const boostMatch = normalized.match(/^(.+?\.\s*)(BOOST.+)$/i);

  if (boostMatch) {
    return {
      fuel: formatSloganLine(boostMatch[1].trim()),
      boost: formatSloganLine(
        boostMatch[2].trim().endsWith('.') ? boostMatch[2].trim() : `${boostMatch[2].trim()}.`
      ),
    };
  }

  const parts = normalized.split(/\.\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const boost = parts.slice(1).join('. ');
    return {
      fuel: formatSloganLine(`${parts[0]}.`),
      boost: formatSloganLine(boost.endsWith('.') ? boost : `${boost}.`),
    };
  }

  return { fuel: formatSloganLine(normalized), boost: '' };
}

function formatSloganLine(line: string): string {
  if (line !== line.toUpperCase()) return line;
  return line
    .toLowerCase()
    .replace(/(^|[.\s])\S/g, (match) => match.toUpperCase());
}
