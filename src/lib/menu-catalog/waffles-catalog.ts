import { waffleExtraModifierSlug } from '@/lib/waffles-menu';
import type {
  WaffleExtraToppingConfig,
  WaffleToppingGroupConfig,
  WafflesCatalogData,
} from '@/types/menu-catalog';

export function buildWaffleToppingGroupsFromExtras(
  extras: WaffleExtraToppingConfig[]
): WaffleToppingGroupConfig[] {
  const groups = new Map<string, string[]>();
  for (const row of extras.filter((entry) => !entry.hidden && entry.name.trim())) {
    const label = row.groupLabel.trim() || 'Other';
    const list = groups.get(label) ?? [];
    list.push(row.name.trim());
    groups.set(label, list);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

export function buildWaffleExtraToppingsFromGroups(
  groups: WaffleToppingGroupConfig[],
  defaultPrice: number
): WaffleExtraToppingConfig[] {
  const out: WaffleExtraToppingConfig[] = [];
  for (const group of groups) {
    for (const name of group.items) {
      const trimmed = name.trim();
      if (!trimmed) continue;
      out.push({
        name: trimmed,
        groupLabel: group.label,
        price: defaultPrice,
      });
    }
  }
  return out;
}

function normalizeExtraToppingRow(
  entry: unknown,
  index: number,
  defaults: WaffleExtraToppingConfig[],
  fallbackPrice: number
): WaffleExtraToppingConfig | null {
  const def = defaults[index];
  if (typeof entry === 'string' && entry.trim()) {
    const match = defaults.find((d) => d.name === entry.trim());
    return {
      name: entry.trim(),
      groupLabel: match?.groupLabel ?? def?.groupLabel ?? 'Other',
      price: match?.price ?? def?.price ?? fallbackPrice,
      hidden: match?.hidden,
    };
  }

  if (!entry || typeof entry !== 'object') return null;
  const row = entry as Partial<WaffleExtraToppingConfig>;
  const name = row.name?.trim() || def?.name;
  if (!name) return null;

  const match = defaults.find((d) => d.name === name);
  const price =
    typeof row.price === 'number' && Number.isFinite(row.price)
      ? row.price
      : (match?.price ?? def?.price ?? fallbackPrice);

  return {
    name,
    groupLabel: row.groupLabel?.trim() || match?.groupLabel || def?.groupLabel || 'Other',
    price,
    hidden: row.hidden,
  };
}

export function normalizeWaffleExtraToppings(
  stored: unknown,
  groups: WaffleToppingGroupConfig[],
  defaults: WaffleExtraToppingConfig[],
  fallbackPrice: number
): WaffleExtraToppingConfig[] {
  if (Array.isArray(stored) && stored.length > 0) {
    const normalized = stored
      .map((entry, index) => normalizeExtraToppingRow(entry, index, defaults, fallbackPrice))
      .filter((row): row is WaffleExtraToppingConfig => row != null);
    if (normalized.length > 0) return normalized;
  }

  if (defaults.length > 0) {
    return defaults.map((entry) => ({ ...entry }));
  }

  return buildWaffleExtraToppingsFromGroups(groups, fallbackPrice);
}

export function normalizeWafflesCatalogData(
  merged: WafflesCatalogData,
  defaults: WafflesCatalogData
): WafflesCatalogData {
  const fallbackPrice = merged.buildYourOwn.extraToppingPrice ?? defaults.buildYourOwn.extraToppingPrice;
  const uniform =
    merged.buildYourOwn.uniformExtraToppingPrice ??
    defaults.buildYourOwn.uniformExtraToppingPrice ??
    true;

  const extraToppings = normalizeWaffleExtraToppings(
    merged.buildYourOwn.extraToppings,
    merged.buildYourOwn.toppingGroups?.length
      ? merged.buildYourOwn.toppingGroups
      : defaults.buildYourOwn.toppingGroups,
    defaults.buildYourOwn.extraToppings,
    fallbackPrice
  ).map((row) =>
    uniform ? { ...row, price: fallbackPrice } : row
  );

  const toppingGroups = buildWaffleToppingGroupsFromExtras(extraToppings);

  return {
    ...merged,
    buildYourOwn: {
      ...merged.buildYourOwn,
      uniformExtraToppingPrice: uniform,
      extraToppings,
      toppingGroups:
        toppingGroups.length > 0 ? toppingGroups : defaults.buildYourOwn.toppingGroups,
    },
  };
}

export function waffleExtraToppingPriceCents(
  buildYourOwn: WafflesCatalogData['buildYourOwn'],
  toppingName: string
): number {
  const row = buildYourOwn.extraToppings.find(
    (entry) => entry.name === toppingName && !entry.hidden
  );
  if (!row) {
    return Math.round(buildYourOwn.extraToppingPrice * 100);
  }
  if (buildYourOwn.uniformExtraToppingPrice) {
    return Math.round(buildYourOwn.extraToppingPrice * 100);
  }
  return Math.round(row.price * 100);
}

export function waffleExtraToppingPriceMap(
  buildYourOwn: WafflesCatalogData['buildYourOwn']
): Record<string, number> {
  const map: Record<string, number> = {};
  for (const row of buildYourOwn.extraToppings.filter((entry) => !entry.hidden)) {
    map[row.name] = waffleExtraToppingPriceCents(buildYourOwn, row.name);
  }
  return map;
}

export { waffleExtraModifierSlug };
