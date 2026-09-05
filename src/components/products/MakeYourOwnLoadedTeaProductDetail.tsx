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
  MYOLT_OPTIONAL_ADDONS,
  MYOLT_PAID_ADDON_PRICE,
  isMakeYourOwnLoadedTeaProduct,
  loadedTeasMenuHref,
  myoltDrinkFromProductSlug,
  myoltLinePriceCents,
  myoltOrderNotes,
  myoltPaidAddonPriceCents,
  myoltRequiredComplete,
  type MyoltOptionalAddonKey,
} from '@/lib/make-your-own-loaded-tea-menu';
import type { IProduct } from '@/models/Product';
import type { IAddIn } from '@/models/AddIn';
import type { Locale } from '@/types';

interface MakeYourOwnLoadedTeaProductDetailProps {
  product: IProduct;
  addIns: IAddIn[];
  locale: Locale;
}

export function MakeYourOwnLoadedTeaProductDetail({
  product,
  addIns,
  locale,
}: MakeYourOwnLoadedTeaProductDetailProps) {
  const { addItem } = useCart();
  const [required, setRequired] = useState<Record<string, string[]>>({});
  const [optionalAddons, setOptionalAddons] = useState<MyoltOptionalAddonKey[]>([]);
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
      }
    : null;

  const unitPrice = orderInput ? myoltLinePriceCents(orderInput) : 0;
  const canAdd = Boolean(
    orderInput && myoltRequiredComplete(orderInput.drink, orderInput.required) && hasPrice(unitPrice)
  );

  const toggleOptionalAddon = (key: MyoltOptionalAddonKey) => {
    setOptionalAddons((current) =>
      current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key]
    );
  };

  const handleAdd = async () => {
    if (!canAdd || !orderInput) return;

    const cartAddIns: { addInId: string; quantity: number }[] = [];

    for (const key of optionalAddons) {
      const addIn = addInBySlug.get(MYOLT_OPTIONAL_ADDONS[key].addInSlug);
      if (addIn) cartAddIns.push({ addInId: String(addIn._id), quantity: 1 });
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
              subtitle={
                group.multiSelect
                  ? locale === 'es'
                    ? 'Elige uno o más'
                    : 'Pick one or more'
                  : locale === 'es'
                    ? 'Requerido'
                    : 'Required'
              }
              options={group.options}
              selected={required[group.id] ?? []}
              max={group.multiSelect ? undefined : 1}
              showSelectionCount={!group.multiSelect}
              locale={locale}
              onChange={(next) => setRequired((current) => ({ ...current, [group.id]: next }))}
            />
          ))}

          {drink.optionalAddons.length > 0 ? (
            <div className="border-t border-grey/15 pt-8">
              <h3 className="font-display text-2xl">{locale === 'es' ? 'Complementos' : 'Add-ons'}</h3>
              <p className="mt-1 text-sm text-grey">
                {locale === 'es'
                  ? `Cada complemento cuesta $${MYOLT_PAID_ADDON_PRICE}.`
                  : `Each add-on is $${MYOLT_PAID_ADDON_PRICE}.`}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {drink.optionalAddons.map((key) => {
                  const addon = MYOLT_OPTIONAL_ADDONS[key];
                  const isSelected = optionalAddons.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleOptionalAddon(key)}
                      aria-pressed={isSelected}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isSelected
                          ? 'border-lime bg-lime/20 text-carbon'
                          : 'border-grey/25 bg-white text-carbon hover:border-pink/40'
                      }`}
                    >
                      {addon.label} (+{formatPrice(myoltPaidAddonPriceCents(), 'USD', locale)})
                    </button>
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
