import { toObjectId } from '@/lib/admin/utils';
import type { ProductFormInput } from '@/lib/validators/product';
import type { DietaryTag } from '@/types';

export function mapProductInput(data: ProductFormInput) {
  return {
    name: data.name,
    slug: data.slug,
    sku: data.sku.toUpperCase(),
    shortDescription: data.shortDescription,
    description: data.fullDescription,
    productType: data.productType,
    categoryId: data.categoryId ? toObjectId(data.categoryId) : undefined,
    images: data.images,
    basePrice: data.price ?? 0,
    compareAtPrice: data.compareAtPrice,
    variants: data.variants ?? [],
    kitSizes: data.kitSizes ?? [],
    flavorIds: (data.flavorIds ?? []).map((id) => toObjectId(id)),
    addInOptions: (data.addInOptions ?? []).map((option) => ({
      addInId: toObjectId(option.addInId),
      maxQuantity: option.maxQuantity ?? 1,
      included: option.included ?? false,
    })),
    inventory: {
      trackInventory: data.trackInventory,
      quantity: data.inventory ?? 0,
      lowStockThreshold: data.lowStockThreshold ?? 5,
      allowBackorder: false,
    },
    dietaryTags: (data.dietaryTags ?? []) as DietaryTag[],
    status: data.status,
    featured: data.featured,
    order: data.displayOrder,
  };
}
