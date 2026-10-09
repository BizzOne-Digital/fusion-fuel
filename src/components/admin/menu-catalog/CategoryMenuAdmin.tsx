'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminStoredImage } from '@/components/admin/AdminStoredImage';
import AdminHeader from '@/components/admin/AdminHeader';
import { adminProductsCategoryHref } from '@/lib/admin/category-catalog';
import { LOADED_TEAS_MENU_VIEWS, MAKE_YOUR_OWN_LOADED_TEA_MENU } from '@/lib/make-your-own-loaded-tea-menu';
import type {
  BowlCategoryCatalogData,
  LoadedTeaAddOnConfig,
  LoadedTeaFlavorConfig,
  LoadedTeaSizeConfig,
  MegaTeasCatalogData,
  MenuCatalogCategorySlug,
  ProteinCoffeeCatalogData,
  ProteinShakesCatalogData,
  ProteinTreatsCatalogData,
  WafflesCatalogData,
  WaffleExtraToppingConfig,
} from '@/types/menu-catalog';
import { defaultNewBowlType } from '@/lib/menu-catalog/bowl-catalog';
import { buildWaffleToppingGroupsFromExtras } from '@/lib/menu-catalog/waffles-catalog';
import {
  Field,
  ItemStatusTags,
  SaveBar,
  SectionCard,
  TextArea,
  TextInput,
  CatalogImageField,
  useMenuCatalog,
} from './menu-catalog-ui';

function slugifyCatalogItemName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function uniqueCatalogSlug(name: string, existingSlugs: string[]): string {
  const base = slugifyCatalogItemName(name) || `item-${Date.now()}`;
  if (!existingSlugs.includes(base)) return base;
  let index = 2;
  while (existingSlugs.includes(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

interface CategoryMenuAdminProps {
  categorySlug: MenuCatalogCategorySlug | 'loaded-teas';
  browseSlug?: string;
  path: string[];
  categoryName: string;
}

export default function CategoryMenuAdmin({
  categorySlug,
  browseSlug,
  path,
  categoryName,
}: CategoryMenuAdminProps) {
  const catalogSlug = (categorySlug === 'loaded-teas' ? 'mega-teas' : categorySlug) as MenuCatalogCategorySlug;
  const { data, setData, loading, saving, save } = useMenuCatalog(catalogSlug);
  const base = adminProductsCategoryHref(browseSlug ?? categorySlug);
  const router = useRouter();

  if (loading || !data) {
    return <p className="text-zinc-500">Loading menu catalog…</p>;
  }

  if (catalogSlug === 'mega-teas') {
    const mega = data as MegaTeasCatalogData;
    if (path[0] === LOADED_TEAS_MENU_VIEWS.loadedTeas) {
      if (path.length === 1) {
        return (
          <LoadedTeasAdmin
            data={mega.loadedTeas}
            setData={(loadedTeas) =>
              setData({ ...(data as MegaTeasCatalogData), loadedTeas })
            }
            saving={saving}
            onSave={() => save()}
            backHref={base}
            categoryName={categoryName}
            flavorHref={(slug) => `${base}/${LOADED_TEAS_MENU_VIEWS.loadedTeas}/${slug}`}
            onAddFlavor={(slug) => router.push(`${base}/${LOADED_TEAS_MENU_VIEWS.loadedTeas}/${slug}`)}
          />
        );
      }
      const flavorSlug = path[1];
      const flavor = mega.loadedTeas.flavors.find((f) => f.slug === flavorSlug);
      if (!flavor) return <p className="text-zinc-500">Flavor not found.</p>;
      return (
        <LoadedTeaFlavorAdmin
          flavor={flavor}
          sizes={mega.loadedTeas.sizes}
          backHref={`${base}/${LOADED_TEAS_MENU_VIEWS.loadedTeas}`}
          onChange={(updated) => {
            const flavors = mega.loadedTeas.flavors.map((f) => (f.slug === updated.slug ? updated : f));
            setData({ ...mega, loadedTeas: { ...mega.loadedTeas, flavors } });
          }}
          onDelete={() => {
            const flavors = mega.loadedTeas.flavors.filter((f) => f.slug !== flavor.slug);
            setData({ ...mega, loadedTeas: { ...mega.loadedTeas, flavors } });
            router.push(`${base}/${LOADED_TEAS_MENU_VIEWS.loadedTeas}`);
          }}
          onSave={async () => {
            await save();
          }}
          saving={saving}
        />
      );
    }
    if (path[0] === MAKE_YOUR_OWN_LOADED_TEA_MENU.slug) {
      if (path.length === 1) {
        return (
          <MyoltListAdmin
            drinks={mega.myoltDrinks}
            backHref={base}
            categoryName={categoryName}
            drinkHref={(slug) => `${base}/${MAKE_YOUR_OWN_LOADED_TEA_MENU.slug}/${slug}`}
          />
        );
      }
      const drink = mega.myoltDrinks.find((d) => d.slug === path[1]);
      if (!drink) return <p className="text-zinc-500">Drink not found.</p>;
      return (
        <MyoltDrinkAdmin
          drink={drink}
          backHref={`${base}/${MAKE_YOUR_OWN_LOADED_TEA_MENU.slug}`}
          onChange={(updated) => {
            const drinks = mega.myoltDrinks.map((d) => (d.slug === updated.slug ? updated : d));
            setData({ ...mega, myoltDrinks: drinks });
          }}
          onSave={() => save()}
          saving={saving}
        />
      );
    }
  }

  if (path[0] === 'manage' || (catalogSlug !== 'mega-teas' && path.length === 0)) {
    const subPath = path[0] === 'manage' ? path.slice(1) : path;
    if (catalogSlug === 'acai-bowls' || catalogSlug === 'protein-bowls') {
      const bowl = data as BowlCategoryCatalogData;
      if (subPath.length === 0) {
        return (
          <BowlCategoryAdmin
            title={categoryName}
            data={bowl}
            setData={(next) => setData(next as typeof data)}
            typeHref={(slug) => `${base}/manage/${slug}`}
            backHref="/admin/products"
            onSave={() => save()}
            saving={saving}
            onAddType={() => {
              const newType = defaultNewBowlType(bowl.types.map((t) => t.slug));
              const next = { ...bowl, types: [...bowl.types, newType] };
              setData(next as typeof data);
              router.push(`${base}/manage/${newType.slug}`);
            }}
          />
        );
      }
      const typeSlug = subPath[0];
      const typeIndex = bowl.types.findIndex((t) => t.slug === typeSlug);
      const type = typeIndex >= 0 ? bowl.types[typeIndex] : undefined;
      if (!type) return <p className="text-zinc-500">Bowl type not found.</p>;
      return (
        <BowlTypeAdmin
          type={type}
          fruits={bowl.fruits}
          toppings={bowl.toppings}
          extraPrice={bowl.extraToppingDefaultPrice}
          backHref={`${base}/manage`}
          onChange={(updated) => {
            const types = [...bowl.types];
            types[typeIndex] = updated;
            setData({ ...bowl, types } as typeof data);
          }}
          onDelete={() => {
            const types = bowl.types.filter((t) => t.slug !== typeSlug);
            setData({ ...bowl, types } as typeof data);
            router.push(`${base}/manage`);
          }}
          onSave={() => save()}
          saving={saving}
        />
      );
    }
    if (categorySlug === 'protein-coffee') {
      return (
        <ProteinCoffeeAdmin
          data={data as ProteinCoffeeCatalogData}
          setData={(next) => setData(next as typeof data)}
          backHref={base}
          onSave={() => save()}
          saving={saving}
        />
      );
    }
    if (categorySlug === 'protein-shakes') {
      return (
        <ProteinShakesAdmin
          data={data as ProteinShakesCatalogData}
          setData={(next) => setData(next as typeof data)}
          backHref={base}
          onSave={() => save()}
          saving={saving}
        />
      );
    }
    if (categorySlug === 'waffles') {
      return (
        <WafflesAdmin
          data={data as WafflesCatalogData}
          setData={(next) => setData(next as typeof data)}
          backHref={base}
          onSave={() => save()}
          saving={saving}
        />
      );
    }
    if (categorySlug === 'protein-treats') {
      return (
        <ProteinTreatsAdmin
          data={data as ProteinTreatsCatalogData}
          setData={(next) => setData(next as typeof data)}
          backHref={base}
          onSave={() => save()}
          saving={saving}
        />
      );
    }
  }

  return <p className="text-zinc-500">Editor not available for this path.</p>;
}

function LoadedTeasAdmin({
  data,
  setData,
  saving,
  onSave,
  backHref,
  categoryName,
  flavorHref,
  onAddFlavor,
}: {
  data: MegaTeasCatalogData['loadedTeas'];
  setData: (d: MegaTeasCatalogData['loadedTeas']) => void;
  saving: boolean;
  onSave: () => void;
  backHref: string;
  categoryName: string;
  flavorHref: (slug: string) => string;
  onAddFlavor: (slug: string) => void;
}) {
  const handleAddFlavor = () => {
    const slug = uniqueCatalogSlug('new-flavor', data.flavors.map((f) => f.slug));
    setData({
      ...data,
      flavors: [
        ...data.flavors,
        {
          slug,
          name: 'New flavor',
          ingredients: [],
        },
      ],
    });
    onAddFlavor(slug);
  };

  return (
    <div>
      <AdminHeader title="Loaded Teas" description={`${categoryName} — sizes, flavors & add-ons`} />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} backLabel={categoryName} />

      <SectionCard title="Main image (home / menu)">
        <CatalogImageField
          label="Upload main image"
          value={data.heroImage?.url}
          onChange={(url) =>
            setData({
              ...data,
              heroImage: { url, alt: data.heroImage?.alt ?? 'Loaded teas' },
            })
          }
        />
      </SectionCard>

      <div className="mt-6 space-y-6">
        <SectionCard title="Size variants & prices">
          {data.sizes.map((size, index) => (
            <div key={size.slug} className="flex flex-wrap items-end gap-3 border-b border-zinc-100 pb-4">
              <Field label="Size">
                <TextInput
                  value={size.name}
                  onChange={(e) => {
                    const sizes = [...data.sizes];
                    sizes[index] = { ...size, name: e.target.value };
                    setData({ ...data, sizes });
                  }}
                />
              </Field>
              <Field label="Price ($)">
                <TextInput
                  type="number"
                  step="0.01"
                  value={size.price}
                  onChange={(e) => {
                    const sizes = [...data.sizes];
                    sizes[index] = { ...size, price: Number(e.target.value) };
                    setData({ ...data, sizes });
                  }}
                />
              </Field>
              <ItemStatusTags
                hidden={size.hidden}
                onToggleHide={() => {
                  const sizes = [...data.sizes];
                  sizes[index] = { ...size, hidden: !size.hidden };
                  setData({ ...data, sizes });
                }}
              />
            </div>
          ))}
        </SectionCard>

        <SectionCard title={`Flavors (${data.flavors.filter((f) => !f.hidden).length} visible)`}>
          <p className="text-xs text-zinc-500">
            Add a flavor, then set its name, photo, and optional 24 oz / 32 oz prices on the edit screen. Click{' '}
            <strong>Save changes</strong> when done.
          </p>
          <ul className="divide-y divide-zinc-100">
            {data.flavors.map((flavor, index) => (
              <li key={flavor.slug} className="flex flex-wrap items-center gap-4 py-3">
                {flavor.image ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                    <AdminStoredImage src={flavor.image} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{flavor.name}</p>
                  <p className="text-xs text-zinc-500">
                    {data.sizes
                      .map((size) => {
                        const override =
                          size.slug === '24oz'
                            ? flavor.price24
                            : size.slug === '32oz'
                              ? flavor.price32
                              : undefined;
                        if (override == null) return null;
                        return `${size.name}: $${override}`;
                      })
                      .filter(Boolean)
                      .join(' · ') || 'Uses default size prices'}
                  </p>
                  <ItemStatusTags
                    hidden={flavor.hidden}
                    onToggleHide={() => {
                      const flavors = [...data.flavors];
                      flavors[index] = { ...flavor, hidden: !flavor.hidden };
                      setData({ ...data, flavors });
                    }}
                    onDelete={() => {
                      setData({ ...data, flavors: data.flavors.filter((f) => f.slug !== flavor.slug) });
                    }}
                  />
                </div>
                <Link href={flavorHref(flavor.slug)} className="text-sm font-semibold text-orange-600">
                  Edit name, photo & prices →
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleAddFlavor}
            className="mt-4 rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
          >
            + Add flavor
          </button>
        </SectionCard>

        <SectionCard title="Add-ons">
          {data.addOns.map((addon, index) => (
            <div key={addon.slug} className="grid gap-3 border-b border-zinc-100 pb-4 sm:grid-cols-3">
              <Field label="Name">
                <TextInput
                  value={addon.name}
                  onChange={(e) => {
                    const addOns = [...data.addOns];
                    addOns[index] = { ...addon, name: e.target.value };
                    setData({ ...data, addOns });
                  }}
                />
              </Field>
              <Field label="Price ($)">
                <TextInput
                  type="number"
                  step="0.01"
                  value={addon.price}
                  onChange={(e) => {
                    const addOns = [...data.addOns];
                    addOns[index] = { ...addon, price: Number(e.target.value) };
                    setData({ ...data, addOns });
                  }}
                />
              </Field>
              <div className="flex items-end">
                <ItemStatusTags
                  hidden={addon.hidden}
                  onToggleHide={() => {
                    const addOns = [...data.addOns];
                    addOns[index] = { ...addon, hidden: !addon.hidden };
                    setData({ ...data, addOns });
                  }}
                />
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

function LoadedTeaFlavorAdmin({
  flavor,
  sizes,
  backHref,
  onChange,
  onDelete,
  onSave,
  saving,
}: {
  flavor: LoadedTeaFlavorConfig;
  sizes: MegaTeasCatalogData['loadedTeas']['sizes'];
  backHref: string;
  onChange: (f: LoadedTeaFlavorConfig) => void;
  onDelete: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <AdminHeader title={flavor.name} description="Flavor image & per-size pricing" />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} backLabel="Loaded teas" />
      <SectionCard title="Details">
        <Field label="Name">
          <TextInput value={flavor.name} onChange={(e) => onChange({ ...flavor, name: e.target.value })} />
        </Field>
        <CatalogImageField
          label="Flavor photo"
          value={flavor.image}
          onChange={(url) => onChange({ ...flavor, image: url })}
        />
        <Field label="Ingredients">
          <TextInput
            value={flavor.ingredients?.join(', ') ?? ''}
            onChange={(e) =>
              onChange({
                ...flavor,
                ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={flavor.isPremium ?? false}
            onChange={(e) => onChange({ ...flavor, isPremium: e.target.checked })}
          />
          Premium pricing tier
        </label>
        {sizes.map((size) => (
          <Field key={size.slug} label={`${size.name} price ($) — leave blank for default`}>
            <TextInput
              type="number"
              step="0.01"
              value={size.slug === '24oz' ? flavor.price24 ?? '' : flavor.price32 ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? undefined : Number(e.target.value);
                onChange(
                  size.slug === '24oz' ? { ...flavor, price24: val } : { ...flavor, price32: val }
                );
              }}
            />
          </Field>
        ))}
        <ItemStatusTags
          hidden={flavor.hidden}
          onToggleHide={() => onChange({ ...flavor, hidden: !flavor.hidden })}
          onDelete={onDelete}
        />
      </SectionCard>
    </div>
  );
}

function MyoltListAdmin({
  drinks,
  backHref,
  categoryName,
  drinkHref,
}: {
  drinks: MegaTeasCatalogData['myoltDrinks'];
  backHref: string;
  categoryName: string;
  drinkHref: (slug: string) => string;
}) {
  return (
    <div>
      <AdminHeader title="Make Your Own Loaded Tea" description={categoryName} />
      <Link href={backHref} className="mb-6 inline-block text-sm text-orange-600 hover:underline">
        ← {categoryName}
      </Link>
      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {drinks.map((drink) => (
          <li key={drink.slug}>
            <Link href={drinkHref(drink.slug)} className="flex items-center justify-between p-4 hover:bg-zinc-50">
              <div>
                <p className="font-semibold text-zinc-900">{drink.name}</p>
                <p className="text-sm text-zinc-600">${drink.price.toFixed(2)}</p>
                {drink.hidden ? <span className="text-xs text-zinc-500">Hidden</span> : null}
              </div>
              <span className="text-orange-600">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MyoltDrinkAdmin({
  drink,
  backHref,
  onChange,
  onSave,
  saving,
}: {
  drink: MegaTeasCatalogData['myoltDrinks'][number];
  backHref: string;
  onChange: (d: MegaTeasCatalogData['myoltDrinks'][number]) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <AdminHeader title={drink.name} />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} />
      <SectionCard title="Drink">
        <Field label="Name">
          <TextInput value={drink.name} onChange={(e) => onChange({ ...drink, name: e.target.value })} />
        </Field>
        <Field label="Description (optional)">
          <TextArea value={drink.description ?? ''} onChange={(e) => onChange({ ...drink, description: e.target.value })} />
        </Field>
        <Field label="Price ($)">
          <TextInput
            type="number"
            step="0.01"
            value={drink.price}
            onChange={(e) => onChange({ ...drink, price: Number(e.target.value) })}
          />
        </Field>
        <CatalogImageField
          label="Drink photo (optional)"
          value={drink.image}
          onChange={(url) => onChange({ ...drink, image: url || undefined })}
        />
        <ItemStatusTags hidden={drink.hidden} onToggleHide={() => onChange({ ...drink, hidden: !drink.hidden })} />
      </SectionCard>
      <SectionCard title="Add-ons">
        {drink.addOns.map((addon, index) => (
          <div key={addon.slug} className="grid gap-2 sm:grid-cols-3">
            <TextInput value={addon.name} disabled />
            <TextInput
              type="number"
              step="0.01"
              value={addon.price}
              onChange={(e) => {
                const addOns = [...drink.addOns];
                addOns[index] = { ...addon, price: Number(e.target.value) };
                onChange({ ...drink, addOns });
              }}
            />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function ExtraToppingsEditor({
  defaultPrice,
  items,
  onDefaultPriceChange,
  onChange,
}: {
  defaultPrice: number;
  items: BowlCategoryCatalogData['extraToppings'];
  onDefaultPriceChange: (price: number) => void;
  onChange: (items: BowlCategoryCatalogData['extraToppings']) => void;
}) {
  const updateRow = (index: number, patch: Partial<BowlCategoryCatalogData['extraToppings'][number]>) => {
    const next = items.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange(next);
  };

  const removeRow = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([
      ...items,
      {
        name: 'New topping',
        price: defaultPrice,
      },
    ]);
  };

  return (
    <SectionCard title="Extra toppings (paid add-ons)">
      <Field label="Default price for new toppings ($)">
        <TextInput
          type="number"
          step="0.01"
          min={0}
          value={defaultPrice}
          onChange={(e) => onDefaultPriceChange(Number(e.target.value))}
        />
      </Field>
      <p className="text-xs text-zinc-500">
        Customers pay these prices when they add extra toppings beyond what is included with their bowl. Click{' '}
        <strong>Save changes</strong> after editing.
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <th className="px-3 py-2.5">Topping name</th>
              <th className="px-3 py-2.5 w-32">Price ($)</th>
              <th className="px-3 py-2.5 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-zinc-500">
                  No extra toppings yet. Add one below.
                </td>
              </tr>
            ) : (
              items.map((extra, index) => (
                <tr key={`extra-${index}`} className="border-t border-zinc-100 align-middle">
                  <td className="px-3 py-2">
                    <TextInput
                      value={extra.name}
                      onChange={(e) => updateRow(index, { name: e.target.value })}
                      placeholder="e.g. Granola"
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      step="0.01"
                      min={0}
                      value={extra.price}
                      onChange={(e) => updateRow(index, { price: Number(e.target.value) })}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <ItemStatusTags
                      hidden={extra.hidden}
                      onToggleHide={() => updateRow(index, { hidden: !extra.hidden })}
                      onDelete={() => removeRow(index)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
      >
        + Add extra topping
      </button>
    </SectionCard>
  );
}

function CatalogAddOnsEditor({
  title,
  items,
  onChange,
  addLabel = '+ Add add-on',
  defaultPrice = 2,
}: {
  title: string;
  items: LoadedTeaAddOnConfig[];
  onChange: (items: LoadedTeaAddOnConfig[]) => void;
  addLabel?: string;
  defaultPrice?: number;
}) {
  const updateRow = (index: number, patch: Partial<LoadedTeaAddOnConfig>) => {
    onChange(items.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([
      ...items,
      {
        slug: `pcof-addon-${Date.now()}`,
        name: 'New add-on',
        price: defaultPrice,
      },
    ]);
  };

  return (
    <SectionCard title={title}>
      <p className="text-xs text-zinc-500">
        Set the add-on name and price shown at checkout. Click <strong>Save changes</strong> after editing.
      </p>
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <th className="px-3 py-2.5">Add-on name</th>
              <th className="px-3 py-2.5 w-32">Price ($)</th>
              <th className="px-3 py-2.5 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-zinc-500">
                  No add-ons yet. Add one below.
                </td>
              </tr>
            ) : (
              items.map((addon, index) => (
                <tr key={addon.slug || `addon-${index}`} className="border-t border-zinc-100 align-middle">
                  <td className="px-3 py-2">
                    <TextInput
                      value={addon.name}
                      onChange={(e) => updateRow(index, { name: e.target.value })}
                      placeholder="e.g. Collagen"
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      step="0.01"
                      min={0}
                      value={addon.price}
                      onChange={(e) => updateRow(index, { price: Number(e.target.value) })}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <ItemStatusTags
                      hidden={addon.hidden}
                      onToggleHide={() => updateRow(index, { hidden: !addon.hidden })}
                      onDelete={() => removeRow(index)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
      >
        {addLabel}
      </button>
    </SectionCard>
  );
}

function CatalogSizesEditor({
  title,
  items,
  onChange,
  defaultPrice = 7.99,
}: {
  title: string;
  items: LoadedTeaSizeConfig[];
  onChange: (items: LoadedTeaSizeConfig[]) => void;
  defaultPrice?: number;
}) {
  const updateRow = (index: number, patch: Partial<LoadedTeaSizeConfig>) => {
    onChange(items.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const addRow = () => {
    const slug = `size-${Date.now()}`;
    onChange([...items, { slug, name: 'New size', price: defaultPrice }]);
  };

  return (
    <SectionCard title={title}>
      <p className="text-xs text-zinc-500">
        Set the size label and price customers see at checkout. Click <strong>Save changes</strong> after editing.
      </p>
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <th className="px-3 py-2.5">Size</th>
              <th className="px-3 py-2.5 w-32">Price ($)</th>
              <th className="px-3 py-2.5 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-zinc-500">
                  No sizes yet. Add one below.
                </td>
              </tr>
            ) : (
              items.map((size, index) => (
                <tr key={size.slug || `size-row-${index}`} className="border-t border-zinc-100 align-middle">
                  <td className="px-3 py-2">
                    <TextInput
                      value={size.name}
                      onChange={(e) => updateRow(index, { name: e.target.value })}
                      placeholder="e.g. 24 oz Iced"
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      step="0.01"
                      min={0}
                      value={size.price}
                      onChange={(e) => updateRow(index, { price: Number(e.target.value) })}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <ItemStatusTags
                      hidden={size.hidden}
                      onToggleHide={() => updateRow(index, { hidden: !size.hidden })}
                      onDelete={() => removeRow(index)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
      >
        + Add size
      </button>
    </SectionCard>
  );
}

function BowlCategoryAdmin({
  title,
  data,
  setData,
  typeHref,
  backHref,
  onSave,
  saving,
  onAddType,
}: {
  title: string;
  data: BowlCategoryCatalogData;
  setData: (d: BowlCategoryCatalogData) => void;
  typeHref: (slug: string) => string;
  backHref: string;
  onSave: () => void;
  saving: boolean;
  onAddType: () => void;
}) {
  return (
    <div>
      <AdminHeader title={title} description="Category hero & bowl types" />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} />
      <SectionCard title="Main (home page image & description)">
        <CatalogImageField
          label="Main category photo"
          value={data.mainImage}
          onChange={(url) => setData({ ...data, mainImage: url })}
        />
        <Field label="Main description (optional)">
          <TextArea
            value={data.mainDescription ?? ''}
            onChange={(e) => setData({ ...data, mainDescription: e.target.value })}
          />
        </Field>
        <Field label="Footnote">
          <TextInput value={data.footnote ?? ''} onChange={(e) => setData({ ...data, footnote: e.target.value })} />
        </Field>
      </SectionCard>
      <SectionCard title="Shared fruits">
        <TextArea
          rows={3}
          value={data.fruits.join(', ')}
          onChange={(e) =>
            setData({
              ...data,
              fruits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </SectionCard>
      <SectionCard title="Shared toppings">
        <TextArea
          rows={4}
          value={data.toppings.join(', ')}
          onChange={(e) =>
            setData({
              ...data,
              toppings: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </SectionCard>
      <ExtraToppingsEditor
        defaultPrice={data.extraToppingDefaultPrice}
        items={data.extraToppings}
        onDefaultPriceChange={(price) => setData({ ...data, extraToppingDefaultPrice: price })}
        onChange={(extraToppings) => setData({ ...data, extraToppings })}
      />
      <SectionCard title="Bowl types">
        <p className="text-xs text-zinc-500">
          Each type is a product on the menu (e.g. Dubai, Regular, Tropical). Hide removes it from the site; Delete
          removes it from this list and archives the product when you save.
        </p>
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                <th className="px-3 py-2.5">Name</th>
                <th className="px-3 py-2.5 w-28">Price ($)</th>
                <th className="px-3 py-2.5 w-40">Status</th>
                <th className="px-3 py-2.5 w-24" />
              </tr>
            </thead>
            <tbody>
              {data.types.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-zinc-500">
                    No bowl types yet.
                  </td>
                </tr>
              ) : (
                data.types.map((type, index) => (
                  <tr key={type.slug} className="border-t border-zinc-100 align-middle">
                    <td className="px-3 py-2">
                      <p className="font-semibold text-zinc-900">{type.name}</p>
                      <p className="text-xs text-zinc-500">acai-bowl-{type.slug}</p>
                    </td>
                    <td className="px-3 py-2 text-zinc-800">${type.price.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      <ItemStatusTags
                        hidden={type.hidden}
                        onToggleHide={() => {
                          const types = [...data.types];
                          types[index] = { ...type, hidden: !type.hidden };
                          setData({ ...data, types });
                        }}
                        onDelete={() => {
                          setData({ ...data, types: data.types.filter((t) => t.slug !== type.slug) });
                        }}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link href={typeHref(type.slug)} className="text-sm font-semibold text-orange-600 hover:underline">
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={onAddType}
          className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          + Add bowl type
        </button>
      </SectionCard>
    </div>
  );
}

function BowlTypeAdmin({
  type,
  fruits,
  toppings,
  extraPrice,
  backHref,
  onChange,
  onDelete,
  onSave,
  saving,
}: {
  type: BowlCategoryCatalogData['types'][number];
  fruits: string[];
  toppings: string[];
  extraPrice: number;
  backHref: string;
  onChange: (t: BowlCategoryCatalogData['types'][number]) => void;
  onDelete: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <AdminHeader title={type.name} />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} />
      <SectionCard title="Type">
        <Field label="Name">
          <TextInput value={type.name} onChange={(e) => onChange({ ...type, name: e.target.value })} />
        </Field>
        <Field label="URL slug (product id)">
          <TextInput
            value={type.slug}
            onChange={(e) =>
              onChange({
                ...type,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]+/g, '-')
                  .replace(/^-|-$/g, ''),
              })
            }
          />
          <p className="mt-1 text-xs text-zinc-500">Store path: /products/acai-bowl-{type.slug || '…'}</p>
        </Field>
        <Field label="Description (optional)">
          <TextArea value={type.description ?? ''} onChange={(e) => onChange({ ...type, description: e.target.value })} />
        </Field>
        <CatalogImageField
          label="Bowl type photo"
          value={type.image}
          onChange={(url) => onChange({ ...type, image: url })}
        />
        <Field label="Price ($)">
          <TextInput
            type="number"
            step="0.01"
            value={type.price}
            onChange={(e) => onChange({ ...type, price: Number(e.target.value) })}
          />
        </Field>
        <Field label="Included fruits (count)">
          <TextInput
            type="number"
            value={type.picksFruits}
            onChange={(e) => onChange({ ...type, picksFruits: Number(e.target.value) })}
          />
        </Field>
        <Field label="Included toppings (count)">
          <TextInput
            type="number"
            value={type.picksToppings}
            onChange={(e) => onChange({ ...type, picksToppings: Number(e.target.value) })}
          />
        </Field>
        <Field label="Fixed includes (comma-separated)">
          <TextInput
            value={type.includes?.join(', ') ?? ''}
            onChange={(e) =>
              onChange({
                ...type,
                includes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </Field>
        <p className="text-xs text-zinc-500">
          Fruits: {fruits.join(', ')} · Toppings: {toppings.join(', ')} · Extra toppings: ${extraPrice} each (set on
          category page)
        </p>
        <ItemStatusTags
          hidden={type.hidden}
          onToggleHide={() => onChange({ ...type, hidden: !type.hidden })}
          onDelete={onDelete}
        />
      </SectionCard>
    </div>
  );
}

function ProteinCoffeeAdmin({
  data,
  setData,
  backHref,
  onSave,
  saving,
}: {
  data: ProteinCoffeeCatalogData;
  setData: (d: ProteinCoffeeCatalogData) => void;
  backHref: string;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <AdminHeader title="Protein Coffee" />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} backLabel="Collection" />
      <SectionCard title="Main gallery image">
        <CatalogImageField
          label="Upload main photo"
          value={data.mainImages[0]?.url}
          onChange={(url) =>
            setData({
              ...data,
              mainImages: [{ url, alt: data.mainImages[0]?.alt ?? 'Protein coffee' }],
            })
          }
        />
      </SectionCard>
      <CatalogSizesEditor
        title="Iced sizes"
        items={data.sizes}
        onChange={(sizes) => setData({ ...data, sizes })}
        defaultPrice={7.99}
      />
      <SectionCard title="Flavors">
        <p className="text-xs text-zinc-500">
          Optional: set a custom price per size for a flavor. Leave blank to use the iced size price above.
        </p>
        {data.flavors.map((flavor, i) => (
          <div key={flavor.slug} className="space-y-3 border-b border-zinc-100 pb-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Flavor name">
                <TextInput
                  value={flavor.name}
                  onChange={(e) => {
                    const flavors = [...data.flavors];
                    flavors[i] = { ...flavor, name: e.target.value };
                    setData({ ...data, flavors });
                  }}
                />
              </Field>
              <CatalogImageField
                label={`${flavor.name || 'Flavor'} photo`}
                value={flavor.image}
                onChange={(url) => {
                  const flavors = [...data.flavors];
                  flavors[i] = { ...flavor, image: url };
                  setData({ ...data, flavors });
                }}
              />
            </div>
            {data.sizes.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.sizes.map((size) => {
                  const override = flavor.sizePrices?.[size.slug];
                  return (
                    <Field key={size.slug} label={`${size.name} price (optional)`}>
                      <TextInput
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder={`Base ${size.price}`}
                        value={override ?? ''}
                        onChange={(e) => {
                          const flavors = [...data.flavors];
                          const raw = e.target.value;
                          const sizePrices = { ...(flavor.sizePrices ?? {}) };
                          if (raw === '') {
                            delete sizePrices[size.slug];
                          } else {
                            sizePrices[size.slug] = Number(raw);
                          }
                          flavors[i] = {
                            ...flavor,
                            sizePrices: Object.keys(sizePrices).length > 0 ? sizePrices : undefined,
                          };
                          setData({ ...data, flavors });
                        }}
                      />
                    </Field>
                  );
                })}
              </div>
            ) : null}
            <ItemStatusTags
              hidden={flavor.hidden}
              onToggleHide={() => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, hidden: !flavor.hidden };
                setData({ ...data, flavors });
              }}
              onDelete={() => {
                setData({ ...data, flavors: data.flavors.filter((_, idx) => idx !== i) });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const slug = uniqueCatalogSlug('new-flavor', data.flavors.map((f) => f.slug));
            setData({
              ...data,
              flavors: [...data.flavors, { slug, name: 'New flavor' }],
            });
          }}
          className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          + Add flavor
        </button>
      </SectionCard>
      <CatalogAddOnsEditor
        title="Optional add-ons"
        items={data.addOns}
        onChange={(addOns) => setData({ ...data, addOns })}
        addLabel="+ Add optional add-on"
        defaultPrice={2}
      />
      <CatalogAddOnsEditor
        title="Formula 1 flavors"
        items={data.formula1Flavors}
        onChange={(formula1Flavors) => setData({ ...data, formula1Flavors })}
        addLabel="+ Add Formula 1 flavor"
        defaultPrice={2}
      />
    </div>
  );
}

function ProteinShakesAdmin({
  data,
  setData,
  backHref,
  onSave,
  saving,
}: {
  data: ProteinShakesCatalogData;
  setData: (d: ProteinShakesCatalogData) => void;
  backHref: string;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <AdminHeader title="Protein Shakes" />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} />
      <SectionCard title="Hero image">
        <CatalogImageField
          label="Upload hero image"
          value={data.heroImage?.url}
          onChange={(url) =>
            setData({ ...data, heroImage: { url, alt: data.heroImage?.alt ?? 'Protein shakes' } })
          }
        />
      </SectionCard>
      <CatalogSizesEditor
        title="Sizes"
        items={data.sizes}
        onChange={(sizes) => setData({ ...data, sizes })}
        defaultPrice={6.99}
      />
      <SectionCard title="Flavors">
        {data.flavors.map((flavor, i) => (
          <div key={flavor.slug} className="space-y-3 border-b border-zinc-100 pb-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Flavor name">
                <TextInput
                  value={flavor.name}
                  onChange={(e) => {
                    const flavors = [...data.flavors];
                    flavors[i] = { ...flavor, name: e.target.value };
                    setData({ ...data, flavors });
                  }}
                />
              </Field>
              <CatalogImageField
                label={`${flavor.name || 'Flavor'} photo`}
                value={flavor.image}
                onChange={(url) => {
                  const flavors = [...data.flavors];
                  flavors[i] = { ...flavor, image: url };
                  setData({ ...data, flavors });
                }}
              />
            </div>
            <ItemStatusTags
              hidden={flavor.hidden}
              onToggleHide={() => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, hidden: !flavor.hidden };
                setData({ ...data, flavors });
              }}
              onDelete={() => {
                setData({ ...data, flavors: data.flavors.filter((_, idx) => idx !== i) });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const slug = uniqueCatalogSlug('new-flavor', data.flavors.map((f) => f.slug));
            setData({
              ...data,
              flavors: [...data.flavors, { slug, name: 'New flavor' }],
            });
          }}
          className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          + Add flavor
        </button>
      </SectionCard>
      <CatalogAddOnsEditor
        title="Optional add-ons"
        items={data.addOns}
        onChange={(addOns) => setData({ ...data, addOns })}
        addLabel="+ Add optional add-on"
        defaultPrice={2}
      />
    </div>
  );
}

function WaffleExtraToppingsEditor({
  buildYourOwn,
  onChange,
}: {
  buildYourOwn: WafflesCatalogData['buildYourOwn'];
  onChange: (next: WafflesCatalogData['buildYourOwn']) => void;
}) {
  const uniform = buildYourOwn.uniformExtraToppingPrice ?? true;
  const items = buildYourOwn.extraToppings ?? [];

  const commitExtras = (extraToppings: WaffleExtraToppingConfig[]) => {
    onChange({
      ...buildYourOwn,
      extraToppings,
      toppingGroups: buildWaffleToppingGroupsFromExtras(extraToppings),
    });
  };

  const updateRow = (index: number, patch: Partial<WaffleExtraToppingConfig>) => {
    const next = items.map((row, i) => (i === index ? { ...row, ...patch } : row));
    commitExtras(next);
  };

  const removeRow = (index: number) => {
    commitExtras(items.filter((_, i) => i !== index));
  };

  const addRow = () => {
    commitExtras([
      ...items,
      {
        name: 'New topping',
        groupLabel: 'Other',
        price: buildYourOwn.extraToppingPrice,
      },
    ]);
  };

  const setUniform = (checked: boolean) => {
    const price = buildYourOwn.extraToppingPrice;
    onChange({
      ...buildYourOwn,
      uniformExtraToppingPrice: checked,
      extraToppings: items.map((row) => ({ ...row, price: checked ? price : row.price })),
      toppingGroups: buildWaffleToppingGroupsFromExtras(items),
    });
  };

  const setUniformPrice = (price: number) => {
    onChange({
      ...buildYourOwn,
      extraToppingPrice: price,
      extraToppings: uniform
        ? items.map((row) => ({ ...row, price }))
        : items,
      toppingGroups: buildWaffleToppingGroupsFromExtras(
        uniform ? items.map((row) => ({ ...row, price })) : items
      ),
    });
  };

  return (
    <SectionCard title="Toppings (included picker & extra pricing)">
      <p className="text-xs text-zinc-500">
        These toppings appear in the create-your-own builder. Guests get up to{' '}
        {buildYourOwn.includedToppingMax} included; additional picks are charged as extras.
      </p>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-800">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-300"
          checked={uniform}
          onChange={(e) => setUniform(e.target.checked)}
        />
        All extra toppings same price ($ each)
      </label>

      {uniform ? (
        <Field label="Price per extra topping ($)">
          <TextInput
            type="number"
            step="0.01"
            min={0}
            value={buildYourOwn.extraToppingPrice}
            onChange={(e) => setUniformPrice(Number(e.target.value))}
          />
        </Field>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
              <th className="px-3 py-2.5">Group</th>
              <th className="px-3 py-2.5">Topping name</th>
              <th className="px-3 py-2.5 w-28">Extra price ($)</th>
              <th className="px-3 py-2.5 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-zinc-500">
                  No toppings yet. Add one below.
                </td>
              </tr>
            ) : (
              items.map((row, index) => (
                <tr key={`waffle-extra-${index}`} className="border-t border-zinc-100 align-middle">
                  <td className="px-3 py-2">
                    <TextInput
                      value={row.groupLabel}
                      onChange={(e) => updateRow(index, { groupLabel: e.target.value })}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      value={row.name}
                      onChange={(e) => updateRow(index, { name: e.target.value })}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      step="0.01"
                      min={0}
                      disabled={uniform}
                      value={uniform ? buildYourOwn.extraToppingPrice : row.price}
                      onChange={(e) => updateRow(index, { price: Number(e.target.value) })}
                      className="!py-1.5 disabled:bg-zinc-100"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <ItemStatusTags
                      hidden={row.hidden}
                      onToggleHide={() => updateRow(index, { hidden: !row.hidden })}
                      onDelete={() => removeRow(index)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
      >
        + Add topping
      </button>
    </SectionCard>
  );
}

function WafflesAdmin({
  data,
  setData,
  backHref,
  onSave,
  saving,
}: {
  data: WafflesCatalogData;
  setData: (d: WafflesCatalogData) => void;
  backHref: string;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <AdminHeader title="Waffles" />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} />
      <SectionCard title="Waffle presets (menu products)">
        {data.presets.map((preset, i) => (
          <div key={preset.slug} className="space-y-2 border-b border-zinc-100 pb-4">
            <Field label="Waffle name">
              <TextInput
                value={preset.name}
                onChange={(e) => {
                  const presets = [...data.presets];
                  presets[i] = { ...preset, name: e.target.value };
                  setData({ ...data, presets });
                }}
              />
            </Field>
            <TextArea
              value={preset.description ?? ''}
              onChange={(e) => {
                const presets = [...data.presets];
                presets[i] = { ...preset, description: e.target.value };
                setData({ ...data, presets });
              }}
            />
            <TextInput
              type="number"
              step="0.01"
              value={preset.price}
              onChange={(e) => {
                const presets = [...data.presets];
                presets[i] = { ...preset, price: Number(e.target.value) };
                setData({ ...data, presets });
              }}
            />
            <CatalogImageField
              label={`${preset.name} photo`}
              value={preset.image}
              onChange={(url) => {
                const presets = [...data.presets];
                presets[i] = { ...preset, image: url };
                setData({ ...data, presets });
              }}
            />
            <ItemStatusTags
              hidden={preset.hidden}
              onToggleHide={() => {
                const presets = [...data.presets];
                presets[i] = { ...preset, hidden: !preset.hidden };
                setData({ ...data, presets });
              }}
              onDelete={() => {
                setData({ ...data, presets: data.presets.filter((_, idx) => idx !== i) });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const slug = uniqueCatalogSlug('new-waffle', data.presets.map((p) => p.slug));
            setData({
              ...data,
              presets: [
                ...data.presets,
                {
                  slug,
                  name: 'New waffle',
                  description: '',
                  price: data.buildYourOwn.price,
                },
              ],
            });
          }}
          className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          + Add waffle preset
        </button>
      </SectionCard>
      <SectionCard title="Create your own waffle">
        <Field label="Price ($)">
          <TextInput
            type="number"
            step="0.01"
            value={data.buildYourOwn.price}
            onChange={(e) =>
              setData({
                ...data,
                buildYourOwn: { ...data.buildYourOwn, price: Number(e.target.value) },
              })
            }
          />
        </Field>
        <Field label="Included toppings (max picks)">
          <TextInput
            type="number"
            min={1}
            value={data.buildYourOwn.includedToppingMax}
            onChange={(e) =>
              setData({
                ...data,
                buildYourOwn: {
                  ...data.buildYourOwn,
                  includedToppingMax: Number(e.target.value),
                },
              })
            }
          />
        </Field>
        <CatalogImageField
          label="Create-your-own waffle photo"
          value={data.buildYourOwn.image}
          onChange={(url) =>
            setData({
              ...data,
              buildYourOwn: { ...data.buildYourOwn, image: url },
            })
          }
        />
        <WaffleExtraToppingsEditor
          buildYourOwn={data.buildYourOwn}
          onChange={(buildYourOwn) => setData({ ...data, buildYourOwn })}
        />
      </SectionCard>
    </div>
  );
}

function ProteinTreatsAdmin({
  data,
  setData,
  backHref,
  onSave,
  saving,
}: {
  data: ProteinTreatsCatalogData;
  setData: (d: ProteinTreatsCatalogData) => void;
  backHref: string;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <AdminHeader title="Protein Treats" />
      <SaveBar saving={saving} onSave={onSave} backHref={backHref} />
      <SectionCard title="Protein truffles — pack options">
        <CatalogImageField
          label="Truffles photo"
          value={data.truffles.image}
          onChange={(url) => setData({ ...data, truffles: { ...data.truffles, image: url } })}
        />
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                <th className="px-3 py-2.5">Label (menu)</th>
                <th className="px-3 py-2.5 w-24">Count</th>
                <th className="px-3 py-2.5 w-32">Price ($)</th>
                <th className="px-3 py-2.5 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.truffles.packs.map((pack, i) => (
                <tr key={pack.slug} className="border-t border-zinc-100 align-middle">
                  <td className="px-3 py-2">
                    <TextInput
                      value={pack.label}
                      onChange={(e) => {
                        const packs = [...data.truffles.packs];
                        packs[i] = { ...pack, label: e.target.value, name: e.target.value };
                        setData({ ...data, truffles: { ...data.truffles, packs } });
                      }}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      min={1}
                      value={pack.count}
                      onChange={(e) => {
                        const packs = [...data.truffles.packs];
                        packs[i] = { ...pack, count: Number(e.target.value) };
                        setData({ ...data, truffles: { ...data.truffles, packs } });
                      }}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      step="0.01"
                      min={0}
                      value={pack.price}
                      onChange={(e) => {
                        const packs = [...data.truffles.packs];
                        packs[i] = { ...pack, price: Number(e.target.value) };
                        setData({ ...data, truffles: { ...data.truffles, packs } });
                      }}
                      className="!py-1.5"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <ItemStatusTags
                      hidden={pack.hidden}
                      onToggleHide={() => {
                        const packs = [...data.truffles.packs];
                        packs[i] = { ...pack, hidden: !pack.hidden };
                        setData({ ...data, truffles: { ...data.truffles, packs } });
                      }}
                      onDelete={() => {
                        setData({
                          ...data,
                          truffles: {
                            ...data.truffles,
                            packs: data.truffles.packs.filter((_, idx) => idx !== i),
                          },
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => {
            const slug = uniqueCatalogSlug('new-pack', data.truffles.packs.map((p) => p.slug));
            setData({
              ...data,
              truffles: {
                ...data.truffles,
                packs: [
                  ...data.truffles.packs,
                  { slug, name: 'New pack', label: 'New pack', price: 3, count: 2 },
                ],
              },
            });
          }}
          className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          + Add truffle pack
        </button>
      </SectionCard>
      <SectionCard title="Mini donuts">
        <Field label="Pack price ($)">
          <TextInput
            type="number"
            step="0.01"
            value={data.miniDonuts.packPrice}
            onChange={(e) =>
              setData({ ...data, miniDonuts: { ...data.miniDonuts, packPrice: Number(e.target.value) } })
            }
          />
        </Field>
        <CatalogImageField
          label="Mini donuts photo"
          value={data.miniDonuts.image}
          onChange={(url) => setData({ ...data, miniDonuts: { ...data.miniDonuts, image: url } })}
        />
        {data.miniDonuts.flavors.map((flavor, i) => (
          <div key={flavor.slug} className="space-y-2 border-b border-zinc-100 pb-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Flavor name">
                <TextInput
                  value={flavor.name}
                  onChange={(e) => {
                    const flavors = [...data.miniDonuts.flavors];
                    flavors[i] = { ...flavor, name: e.target.value };
                    setData({ ...data, miniDonuts: { ...data.miniDonuts, flavors } });
                  }}
                />
              </Field>
              <CatalogImageField
                label={`${flavor.name || 'Flavor'} photo`}
                value={flavor.image}
                onChange={(url) => {
                  const flavors = [...data.miniDonuts.flavors];
                  flavors[i] = { ...flavor, image: url };
                  setData({ ...data, miniDonuts: { ...data.miniDonuts, flavors } });
                }}
              />
            </div>
            <ItemStatusTags
              hidden={flavor.hidden}
              onToggleHide={() => {
                const flavors = [...data.miniDonuts.flavors];
                flavors[i] = { ...flavor, hidden: !flavor.hidden };
                setData({ ...data, miniDonuts: { ...data.miniDonuts, flavors } });
              }}
              onDelete={() => {
                setData({
                  ...data,
                  miniDonuts: {
                    ...data.miniDonuts,
                    flavors: data.miniDonuts.flavors.filter((_, idx) => idx !== i),
                  },
                });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const slug = uniqueCatalogSlug('new-flavor', data.miniDonuts.flavors.map((f) => f.slug));
            setData({
              ...data,
              miniDonuts: {
                ...data.miniDonuts,
                flavors: [...data.miniDonuts.flavors, { slug, name: 'New flavor' }],
              },
            });
          }}
          className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          + Add mini donut flavor
        </button>
      </SectionCard>
      <SectionCard title="Pie in a cup">
        <CatalogImageField
          label="Pie in a cup main photo"
          value={data.pieInACup.mainImage}
          onChange={(url) => setData({ ...data, pieInACup: { ...data.pieInACup, mainImage: url } })}
        />
        <CatalogSizesEditor
          title="Sizes"
          items={data.pieInACup.sizes}
          onChange={(sizes) => setData({ ...data, pieInACup: { ...data.pieInACup, sizes } })}
          defaultPrice={4.99}
        />
        <p className="text-xs text-zinc-500">
          Optional per-flavor prices override the base size price. Leave blank to use the size price above.
        </p>
        {data.pieInACup.flavors.map((flavor, i) => (
          <div key={flavor.slug} className="space-y-3 border-b border-zinc-100 pb-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Flavor name">
                <TextInput
                  value={flavor.name}
                  onChange={(e) => {
                    const flavors = [...data.pieInACup.flavors];
                    flavors[i] = { ...flavor, name: e.target.value };
                    setData({ ...data, pieInACup: { ...data.pieInACup, flavors } });
                  }}
                />
              </Field>
              <CatalogImageField
                label={`${flavor.name || 'Flavor'} photo`}
                value={flavor.image}
                onChange={(url) => {
                  const flavors = [...data.pieInACup.flavors];
                  flavors[i] = { ...flavor, image: url };
                  setData({ ...data, pieInACup: { ...data.pieInACup, flavors } });
                }}
              />
            </div>
            {data.pieInACup.sizes.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {data.pieInACup.sizes.map((size) => {
                  const override = flavor.sizePrices?.[size.slug];
                  return (
                    <Field key={size.slug} label={`${size.name} price (optional)`}>
                      <TextInput
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder={`Base ${size.price}`}
                        value={override ?? ''}
                        onChange={(e) => {
                          const flavors = [...data.pieInACup.flavors];
                          const raw = e.target.value;
                          const sizePrices = { ...(flavor.sizePrices ?? {}) };
                          if (raw === '') {
                            delete sizePrices[size.slug];
                          } else {
                            sizePrices[size.slug] = Number(raw);
                          }
                          flavors[i] = {
                            ...flavor,
                            sizePrices: Object.keys(sizePrices).length > 0 ? sizePrices : undefined,
                          };
                          setData({ ...data, pieInACup: { ...data.pieInACup, flavors } });
                        }}
                      />
                    </Field>
                  );
                })}
              </div>
            ) : null}
            <ItemStatusTags
              hidden={flavor.hidden}
              onToggleHide={() => {
                const flavors = [...data.pieInACup.flavors];
                flavors[i] = { ...flavor, hidden: !flavor.hidden };
                setData({ ...data, pieInACup: { ...data.pieInACup, flavors } });
              }}
              onDelete={() => {
                setData({
                  ...data,
                  pieInACup: {
                    ...data.pieInACup,
                    flavors: data.pieInACup.flavors.filter((_, idx) => idx !== i),
                  },
                });
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const slug = uniqueCatalogSlug('new-flavor', data.pieInACup.flavors.map((f) => f.slug));
            setData({
              ...data,
              pieInACup: {
                ...data.pieInACup,
                flavors: [...data.pieInACup.flavors, { slug, name: 'New flavor' }],
              },
            });
          }}
          className="rounded-lg border border-dashed border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
        >
          + Add pie flavor
        </button>
      </SectionCard>
    </div>
  );
}
