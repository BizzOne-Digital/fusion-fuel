import type { IAddIn } from '@/models/AddIn';
import type { IProduct } from '@/models/Product';
import { productExcludesOptionalAddOns } from '@/lib/protein-treats-menu';

export function resolveProductAddIns(product: IProduct, allAddIns: IAddIn[]): IAddIn[] {
  if (productExcludesOptionalAddOns(product.slug)) return [];
  if (!product.addInOptions?.length) return [];

  const allowed = new Set(product.addInOptions.map((option) => String(option.addInId)));
  return allAddIns.filter((addIn) => allowed.has(String(addIn._id)));
}

export function isAddInIncluded(product: IProduct, addInId: string): boolean {
  const option = product.addInOptions?.find((entry) => String(entry.addInId) === addInId);
  return Boolean(option?.included);
}

export function getAddInUnitPrice(product: IProduct, addIn: IAddIn): number {
  if (isAddInIncluded(product, String(addIn._id))) return 0;
  return addIn.price;
}

export function getAddInMaxQuantity(product: IProduct, addInId: string): number {
  const option = product.addInOptions?.find((entry) => String(entry.addInId) === addInId);
  return option?.maxQuantity ?? 5;
}
