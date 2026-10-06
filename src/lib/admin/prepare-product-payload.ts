import ProductCategory from '@/models/ProductCategory';
import type { ProductFormInput } from '@/lib/validators/product';
import { normalizeLocalized } from '@/lib/admin/localized';
import { syncProductAddOns, syncProductFlavors } from '@/lib/admin/sync-product-catalog';

export async function prepareProductPayload(
  parsed: ProductFormInput
): Promise<ProductFormInput> {
  const category = parsed.categoryId
    ? await ProductCategory.findById(parsed.categoryId).lean()
    : null;
  const categorySlug =
    category && typeof category === 'object' && 'slug' in category
      ? String(category.slug)
      : 'general';

  const name = normalizeLocalized(parsed.name);
  const shortDescription = normalizeLocalized(parsed.shortDescription);
  const fullDescription = normalizeLocalized({
    en: parsed.fullDescription.en,
    es: parsed.fullDescription.es,
  });

  let flavorIds = parsed.flavorIds ?? [];
  let addInOptions = parsed.addInOptions ?? [];

  if (parsed.enableFlavors) {
    const synced = await syncProductFlavors(
      parsed.slug,
      categorySlug,
      parsed.inlineFlavors ?? []
    );
    flavorIds = synced.map((id) => String(id));
  } else if (parsed.enableFlavors === false) {
    flavorIds = [];
  }

  if (parsed.enableAddOns) {
    const synced = await syncProductAddOns(parsed.slug, categorySlug, parsed.inlineAddOns ?? []);
    addInOptions = synced.map((option) => ({
      addInId: String(option.addInId),
      maxQuantity: option.maxQuantity,
      included: option.included,
    }));
  } else if (parsed.enableAddOns === false) {
    addInOptions = [];
  }

  return {
    ...parsed,
    name,
    shortDescription,
    fullDescription,
    flavorIds,
    addInOptions,
  };
}
