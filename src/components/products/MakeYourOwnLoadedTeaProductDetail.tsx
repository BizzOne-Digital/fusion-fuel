'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { ModifierChipGroup } from '@/components/products/ModifierChipGroup';
import {
  LOADED_TEAS_MENU_VIEWS,
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  MYOLT_EXTRA_SELECTION_PRICE,
  type MyoltRequiredGroup,
  MYOLT_OPTIONAL_ADDONS,
  isMakeYourOwnLoadedTeaProduct,
  loadedTeasMenuHref,
  myoltAddonFlavorOptions,
  myoltAddonHasFlavorOptions,
  myoltAddonPriceCents,
  myoltAddonSelectionComplete,
  myoltDrinkFromProductSlug,
  myoltLinePriceCents,
  myoltOrderNotes,
  myoltRequiredComplete,
  type MyoltOptionalAddonFlavors,
  type MyoltOptionalAddonKey,
  type MyoltOptionalAddonQuantities,
} from '@/lib/make-your-own-loaded-tea-menu';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';

const MYOLT_ADDON_MAX_QUANTITY = 10;

interface MakeYourOwnLoadedTeaProductDetailProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
}

function groupSubtitle(group: MyoltRequiredGroup, locale: Locale): string | undefined {
  if (group.includedCount != null && group.includedCount > 0) {
    const extraPrice = group.extraSelectionPrice ?? MYOLT_EXTRA_SELECTION_PRICE;
    return locale === 'es'
      ? `Primera selección incluida · +$${extraPrice} cada adicional`
      : `First selection included · +$${extraPrice} each additional`;
  }
  if (group.multiSelect) {
    return locale === 'es' ? 'Elige uno o más' : 'Pick one or more';
  }
  return locale === 'es' ? 'Requerido' : 'Required';
}

export function MakeYourOwnLoadedTeaProductDetail({
  product,
  addIns,
  locale,
}: MakeYourOwnLoadedTeaProductDetailProps) {
  const { addItem } = useCart();
  const [required, setRequired] = useState<Record<string, string[]>>({});
  const [optionalAddons, setOptionalAddons] = useState<MyoltOptionalAddonQuantities>({});
  const [addonFlavors, setAddonFlavors] = useState<MyoltOptionalAddonFlavors>({});
  const [loading, setLoading] = useState(false);

  const drink = myoltDrinkFromProductSlug(product.slug);
  const name = getLocalized(product.name, locale);

  const addInBySlug = useMemo(() => {
    const map = new Map<string, IAddIn>();
    for (const addIn of addIns) {
      map.set(addIn.slug, addIn);
    }
    return map;
  }, [addIns]);

  const orderInput = drink
    ? {
        drink,
        required,
        optionalAddons,
        addonFlavors,
      }
    : null;

  const unitPrice = orderInput ? myoltLinePriceCents(orderInput) : 0;
  const canAdd = Boolean(
    orderInput &&
      myoltRequiredComplete(orderInput.drink, orderInput.required) &&
      myoltAddonSelectionComplete(orderInput.drink, orderInput.optionalAddons, orderInput.addonFlavors) &&
      hasPrice(unitPrice)
  );

  const setAddonQuantity = (key: MyoltOptionalAddonKey, quantity: number) => {
    const nextQty = Math.max(0, Math.min(MYOLT_ADDON_MAX_QUANTITY, quantity));
    setOptionalAddons((current) => {
      const next = { ...current };
      if (nextQty === 0) delete next[key];
      else next[key] = nextQty;
      return next;
    });

    if (!myoltAddonHasFlavorOptions(key)) return;

    setAddonFlavors((current) => {
      const next = { ...current };
      const flavors = [...(current[key] ?? [])];
      while (flavors.length < nextQty) flavors.push('');
      while (flavors.length > nextQty) flavors.pop();
      if (flavors.length === 0) delete next[key];
      else next[key] = flavors;
      return next;
    });
  };

  const setAddonFlavorAt = (key: MyoltOptionalAddonKey, index: number, flavor: string) => {
    setAddonFlavors((current) => {
      const flavors = [...(current[key] ?? [])];
      flavors[index] = flavor;
      return { ...current, [key]: flavors };
    });
  };

  const handleAdd = async () => {
    if (!canAdd || !orderInput) return;

    const cartAddIns: { addInId: string; quantity: number }[] = [];

    for (const key of drink!.optionalAddons) {
      const qty = optionalAddons[key] ?? 0;
      if (qty === 0) continue;
      const addIn = addInBySlug.get(MYOLT_OPTIONAL_ADDONS[key].addInSlug);
      if (addIn) cartAddIns.push({ addInId: String(addIn._id), quantity: qty });
    }

    setLoading(true);
    await addItem({
      productId: String(product._id),
      quantity: 1,
      variantSku: product.variants[0]?.sku,
      notes: myoltOrderNotes(orderInput),
      addIns: cartAddIns,
    });
    setLoading(false);
  };

  if (!isMakeYourOwnLoadedTeaProduct(product.slug) || !drink) return null;

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
          <Image
            src={MAKE_YOUR_OWN_LOADED_TEA_MENU.image.url}
            alt={MAKE_YOUR_OWN_LOADED_TEA_MENU.image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      <div>
        <Link
          href={loadedTeasMenuHref(LOADED_TEAS_MENU_VIEWS.makeYourOwn)}
          className="text-sm font-semibold text-pink hover:underline"
        >
          {locale === 'es' ? '← Volver a Make Your Own Loaded Tea' : '← Back to Make Your Own Loaded Tea'}
        </Link>
        <h1 className="mt-3 font-display text-5xl">{name}</h1>
        <p className="mt-2 text-grey">
          {locale === 'es' ? 'Incluye: ' : 'Included: '}
          {drink.includedSummary}
        </p>
        {hasPrice(unitPrice) && (
          <p className="mt-4 font-display text-3xl text-pink">
            {formatPrice(unitPrice, 'USD', locale)}
          </p>
        )}

        <div className="mt-6 rounded-2xl border border-grey/15 bg-cream p-4 text-sm">
          <p className="font-semibold text-carbon">{drink.websiteNotice}</p>
        </div>

        <div className="mt-8 space-y-8 rounded-2xl border border-grey/15 bg-cream p-6">
          {drink.requiredGroups.map((group) => (
            <ModifierChipGroup
              key={group.id}
              title={group.title}
              subtitle={groupSubtitle(group, locale)}
              options={group.options}
              selected={required[group.id] ?? []}
              max={group.includedCount != null ? undefined : group.multiSelect ? undefined : 1}
              showSelectionCount={group.includedCount == null && !group.multiSelect}
              locale={locale}
              onChange={(next) => setRequired((current) => ({ ...current, [group.id]: next }))}
            />
          ))}

          {drink.optionalAddons.length > 0 ? (
            <div className="border-t border-grey/15 pt-8">
              <h3 className="font-display text-2xl">{locale === 'es' ? 'Complementos' : 'Add-ons'}</h3>
              <div className="mt-6 space-y-4">
                {drink.optionalAddons.map((key) => {
                  const addon = MYOLT_OPTIONAL_ADDONS[key];
                  const qty = optionalAddons[key] ?? 0;
                  const flavorOptions = myoltAddonFlavorOptions(key);
                  const flavors = addonFlavors[key] ?? [];

                  return (
                    <div key={key} className="rounded-xl bg-white p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-carbon">{addon.label}</p>
                          <p className="text-sm text-grey">
                            {formatPrice(myoltAddonPriceCents(key), 'USD', locale)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={locale === 'es' ? 'Reducir cantidad' : 'Decrease quantity'}
                            onClick={() => setAddonQuantity(key, qty - 1)}
                            disabled={qty === 0}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-grey/25 text-carbon disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-medium">{qty}</span>
                          <button
                            type="button"
                            aria-label={locale === 'es' ? 'Aumentar cantidad' : 'Increase quantity'}
                            onClick={() => setAddonQuantity(key, qty + 1)}
                            disabled={qty >= MYOLT_ADDON_MAX_QUANTITY}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-grey/25 text-carbon disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {qty > 0 && flavorOptions.length > 0 ? (
                        <div className="mt-4 space-y-4 border-t border-grey/10 pt-4">
                          {Array.from({ length: qty }, (_, index) => (
                            <ModifierChipGroup
                              key={`${key}-${index}`}
                              title={
                                locale === 'es'
                                  ? `${addon.label} — sabor ${index + 1}`
                                  : `${addon.label} — flavor ${index + 1}`
                              }
                              options={flavorOptions}
                              selected={flavors[index] ? [flavors[index]] : []}
                              max={1}
                              showSelectionCount={false}
                              locale={locale}
                              onChange={(next) => setAddonFlavorAt(key, index, next[0] ?? '')}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey/15 pt-6">
            <p className="font-display text-2xl text-pink">
              {formatPrice(unitPrice, 'USD', locale)}
            </p>
            <Button onClick={handleAdd} disabled={!canAdd || loading} loading={loading}>
              {locale === 'es' ? 'Agregar al carrito' : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
