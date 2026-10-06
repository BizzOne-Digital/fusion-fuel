import { notFound } from 'next/navigation';
import { acaiBowlMenuItem, isAcaiBowlProduct } from '@/lib/acai-bowls-menu';
import {
  isMakeYourOwnLoadedTeaProduct,
  myoltDrinkFromProductSlug,
} from '@/lib/make-your-own-loaded-tea-menu';
import { isMegaTeaKitDetailProduct } from '@/lib/mega-tea-kits-menu';
import {
  isPieInACupProduct,
  isProteinTreatProduct,
  proteinTreatMenuItem,
} from '@/lib/protein-treats-menu';
import { isWaffleProduct, waffleMenuItem } from '@/lib/waffles-menu';

/** Ensures specialized menu builders have config — otherwise show 404 instead of a blank page. */
export function assertProductMenuConfig(slug: string): void {
  if (isAcaiBowlProduct(slug) && !acaiBowlMenuItem(slug)) {
    notFound();
  }
  if (isWaffleProduct(slug) && !waffleMenuItem(slug)) {
    notFound();
  }
  if (isMakeYourOwnLoadedTeaProduct(slug) && !myoltDrinkFromProductSlug(slug)) {
    notFound();
  }
  if (isProteinTreatProduct(slug) && !isPieInACupProduct(slug) && !proteinTreatMenuItem(slug)) {
    notFound();
  }
  if (slug.startsWith('mega-tea-kit-') && !isMegaTeaKitDetailProduct(slug)) {
    notFound();
  }
}
