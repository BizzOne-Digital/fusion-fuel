import { revalidatePath } from 'next/cache';

const LOCALES = ['en', 'es'] as const;

/** Bust cached menu/product pages after admin catalog changes. */
export function revalidateStorefrontCatalog(options?: { productSlug?: string }) {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/menu`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/pricing`);
    if (options?.productSlug) {
      revalidatePath(`/${locale}/products/${options.productSlug}`);
    }
  }
}
