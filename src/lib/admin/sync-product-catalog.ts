import { Types } from 'mongoose';
import { normalizeLocalized } from '@/lib/admin/localized';
import { toObjectId } from '@/lib/admin/utils';
import Flavor from '@/models/Flavor';
import AddIn from '@/models/AddIn';
import { SLUG_REGEX } from '@/lib/constants';

export type InlineFlavorInput = {
  id?: string;
  name: { en: string; es: string };
  description?: { en: string; es: string };
  image?: { url: string; alt: string; width?: number; height?: number };
};

export type InlineAddOnInput = {
  id?: string;
  name: { en: string; es: string };
  description?: { en: string; es: string };
  price: number;
};

function slugifyPart(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : 'item';
}

function buildFlavorSlug(productSlug: string, nameEn: string, index: number): string {
  const candidate = `${productSlug}-${slugifyPart(nameEn)}`;
  return SLUG_REGEX.test(candidate) ? candidate : `${productSlug}-flavor-${index + 1}`;
}

function buildAddInSlug(productSlug: string, nameEn: string, index: number): string {
  const candidate = `${productSlug}-addon-${slugifyPart(nameEn)}`;
  return SLUG_REGEX.test(candidate) ? candidate : `${productSlug}-addon-${index + 1}`;
}

export async function syncProductFlavors(
  productSlug: string,
  categorySlug: string,
  flavors: InlineFlavorInput[]
): Promise<Types.ObjectId[]> {
  const ids: Types.ObjectId[] = [];

  for (const [index, flavor] of flavors.entries()) {
    const name = normalizeLocalized(flavor.name);
    const description = flavor.description
      ? normalizeLocalized({
          en: flavor.description.en ?? '',
          es: flavor.description.es ?? '',
        })
      : { en: '', es: '' };

    const payload = {
      name,
      category: categorySlug,
      color: '#FF6B35',
      description,
      ...(flavor.image?.url ? { image: flavor.image } : {}),
      status: 'published' as const,
      order: index,
    };

    let doc;
    if (flavor.id) {
      doc = await Flavor.findByIdAndUpdate(toObjectId(flavor.id), { $set: payload }, { new: true });
    } else {
      const slug = buildFlavorSlug(productSlug, name.en, index);
      doc = await Flavor.findOneAndUpdate(
        { slug },
        { $set: { ...payload, slug } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (doc) {
      ids.push(doc._id);
    }
  }

  return ids;
}

export async function syncProductAddOns(
  productSlug: string,
  categorySlug: string,
  addOns: InlineAddOnInput[]
): Promise<Array<{ addInId: Types.ObjectId; maxQuantity: number; included: boolean }>> {
  const options: Array<{ addInId: Types.ObjectId; maxQuantity: number; included: boolean }> = [];

  for (const [index, addOn] of addOns.entries()) {
    const name = normalizeLocalized(addOn.name);
    const description = addOn.description
      ? normalizeLocalized({
          en: addOn.description.en ?? '',
          es: addOn.description.es ?? '',
        })
      : { en: '', es: '' };

    const payload = {
      name,
      category: categorySlug,
      description,
      price: addOn.price,
      status: 'published' as const,
      order: index,
    };

    let doc;
    if (addOn.id) {
      doc = await AddIn.findByIdAndUpdate(toObjectId(addOn.id), { $set: payload }, { new: true });
    } else {
      const slug = buildAddInSlug(productSlug, name.en, index);
      doc = await AddIn.findOneAndUpdate(
        { slug },
        { $set: { ...payload, slug } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (doc) {
      options.push({
        addInId: doc._id,
        maxQuantity: 1,
        included: false,
      });
    }
  }

  return options;
}
