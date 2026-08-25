import type { IAddIn } from '@/models/AddIn';
import type { IProduct } from '@/models/Product';

export function resolveProductAddIns(product: IProduct, allAddIns: IAddIn[]): IAddIn[] {
  if (!product.addInOptions?.length) return [];

  const allowed = new Set(product.addInOptions.map((option) => String(option.addInId)));
  return allAddIns.filter((addIn) => allowed.has(String(addIn._id)));
}

export function getAddInMaxQuantity(product: IProduct, addInId: string): number {
  const option = product.addInOptions?.find((entry) => String(entry.addInId) === addInId);
  return option?.maxQuantity ?? 5;
}
