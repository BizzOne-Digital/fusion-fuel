'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized, formatPrice, hasPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { ModifierChipGroup } from '@/components/products/ModifierChipGroup';
import {
  MAKE_YOUR_OWN_LOADED_TEA_MENU,
  MYOLT_FLAVORS,
  MYOLT_HYDRATION_OPTIONS,
  MYOLT_OPTIONAL_ADDONS,
  MYOLT_PAID_ADDON_PRICE,
  isMakeYourOwnLoadedTeaProduct,
  myoltDrinkFromProductSlug,
  myoltHydrationAddInSlug,
  myoltHydrationIsPaid,
  myoltLinePriceCents,
  myoltOrderNotes,
  myoltPaidAddonPriceCents,
  myoltRequiredComplete,
  myoltAdditionalFlavorAddInSlug,
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
  const [extraFlavors, setExtraFlavors] = useState<string[]>([]);
  const [optionalAddons, setOptionalAddons] = useState<MyoltOptionalAddonKey[]>([]);
  const [hydration, setHydration] = useState<string[]>([MYOLT_HYDRATION_OPTIONS[0]]);
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

  const requiredValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const [key, selections] of Object.entries(required)) {
      if (selections[0]) values[key] = selections[0];
    }
    return values;
  }, [required]);

  const hydrationValue = hydration[0] ?? MYOLT_HYDRATION_OPTIONS[0];

  const orderInput = drink
    ? {
        drink,
        required: requiredValues,
        extraFlavors,
        optionalAddons,
        hydration: hydrationValue,
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
    const flavorAddIn = addInBySlug.get(myoltAdditionalFlavorAddInSlug());
    if (flavorAddIn && extraFlavors.length > 0) {
      cartAddIns.push({ addInId: String(flavorAddIn._id), quantity: extraFlavors.length });
    }

    for (const key of optionalAddons) {
      const addIn = addInBySlug.get(MYOLT_OPTIONAL_ADDONS[key].addInSlug);
      if (addIn) cartAddIns.push({ addInId: String(addIn._id), quantity: 1 });
    }

    if (myoltHydrationIsPaid(hydrationValue)) {
      const hydrationAddIn = addInBySlug.get(myoltHydrationAddInSlug());
      if (hydrationAddIn) {
        cartAddIns.push({ addInId: String(hydrationAddIn._id), quantity: 1 });
      }
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
          href="/menu?category=make-your-own-loaded-tea"
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

        <div className="mt-6 rounded-2xl border border-grey/15 bg-cream p-4 text-sm text-grey">
          <p className="font-semibold text-carbon">
            {locale === 'es' ? 'Aviso del sitio' : 'Website notice'}
          </p>
          <p className="mt-2">{drink.websiteNotice}</p>
        </div>

        <div className="mt-8 space-y-8 rounded-2xl border border-grey/15 bg-cream p-6">
          {drink.requiredGroups.map((group) => (
            <ModifierChipGroup
              key={group.id}
              title={group.title}
              subtitle={locale === 'es' ? 'Requerido' : 'Required'}
              options={group.options}
              selected={required[group.id] ?? []}
              max={1}
              locale={locale}
              onChange={(next) => setRequired((current) => ({ ...current, [group.id]: next }))}
            />
          ))}

          <div className="border-t border-grey/15 pt-8">
            <h3 className="font-display text-2xl">
              {locale === 'es' ? 'Modificadores opcionales' : 'Optional modifiers'}
            </h3>
            <p className="mt-1 text-sm text-grey">
              {locale === 'es'
                ? `Cada extra cuesta $${MYOLT_PAID_ADDON_PRICE}.`
                : `Each add-on is $${MYOLT_PAID_ADDON_PRICE}.`}
            </p>

            <div className="mt-6">
              <ModifierChipGroup
                title={locale === 'es' ? 'Sabor adicional' : 'Additional flavor'}
                subtitle={
                  locale === 'es'
                    ? 'Elige tantos como quieras'
                    : 'Pick as many as you like'
                }
                options={MYOLT_FLAVORS}
                selected={extraFlavors}
                priceCents={myoltPaidAddonPriceCents()}
                locale={locale}
                onChange={setExtraFlavors}
              />
            </div>

            {drink.optionalAddons.length > 0 ? (
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
            ) : null}

            {drink.hydration ? (
              <div className="mt-6">
                <ModifierChipGroup
                  title={locale === 'es' ? 'Soporte de hidratación' : 'Add Hydration Support'}
                  subtitle={
                    locale === 'es'
                      ? 'Las opciones de hidratación cuestan $1'
                      : 'Paid hydration options are $1'
                  }
                  options={MYOLT_HYDRATION_OPTIONS}
                  selected={hydration}
                  max={1}
                  locale={locale}
                  onChange={setHydration}
                />
              </div>
            ) : null}
          </div>

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
