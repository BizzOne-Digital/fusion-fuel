'use client';

import Link from 'next/link';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import { adminProductsCategoryHref } from '@/lib/admin/category-catalog';
import { LOADED_TEAS_MENU_VIEWS, MAKE_YOUR_OWN_LOADED_TEA_MENU } from '@/lib/make-your-own-loaded-tea-menu';
import type {
  BowlCategoryCatalogData,
  LoadedTeaFlavorConfig,
  MegaTeasCatalogData,
  MenuCatalogCategorySlug,
  ProteinCoffeeCatalogData,
  ProteinShakesCatalogData,
  ProteinTreatsCatalogData,
  WafflesCatalogData,
} from '@/types/menu-catalog';
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
            onSave={() => save(data as MegaTeasCatalogData)}
            backHref={base}
            categoryName={categoryName}
            onOpenFlavor={() => {}}
            flavorHref={(slug) => `${base}/${LOADED_TEAS_MENU_VIEWS.loadedTeas}/${slug}`}
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
          onSave={async () => {
            await save(data as MegaTeasCatalogData);
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
          onSave={() => save(data as MegaTeasCatalogData)}
          saving={saving}
        />
      );
    }
  }

  if (path[0] === 'manage' || (catalogSlug !== 'mega-teas' && path.length === 0)) {
    const subPath = path[0] === 'manage' ? path.slice(1) : path;
    if (categorySlug === 'acai-bowls' || categorySlug === 'protein-bowls') {
      const bowl = data as BowlCategoryCatalogData;
      if (subPath.length === 0) {
        return (
          <BowlCategoryAdmin
            title={categoryName}
            data={bowl}
            setData={(next) => setData(next as typeof data)}
            typeHref={(slug) => `${base}/manage/${slug}`}
            backHref="/admin/products"
            onSave={() => save(data)}
            saving={saving}
          />
        );
      }
      const type = bowl.types.find((t) => t.slug === subPath[0]);
      if (!type) return <p className="text-zinc-500">Bowl type not found.</p>;
      return (
        <BowlTypeAdmin
          type={type}
          fruits={bowl.fruits}
          toppings={bowl.toppings}
          extraPrice={bowl.extraToppingDefaultPrice}
          backHref={`${base}/manage`}
          onChange={(updated) => {
            const types = bowl.types.map((t) => (t.slug === updated.slug ? updated : t));
            setData({ ...bowl, types } as typeof data);
          }}
          onSave={() => save(data)}
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
          onSave={() => save(data)}
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
          onSave={() => save(data)}
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
          onSave={() => save(data)}
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
          onSave={() => save(data)}
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
}: {
  data: MegaTeasCatalogData['loadedTeas'];
  setData: (d: MegaTeasCatalogData['loadedTeas']) => void;
  saving: boolean;
  onSave: () => void;
  backHref: string;
  categoryName: string;
  onOpenFlavor: (slug: string) => void;
  flavorHref: (slug: string) => string;
}) {
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
          <ul className="divide-y divide-zinc-100">
            {data.flavors.map((flavor, index) => (
              <li key={flavor.slug} className="flex flex-wrap items-center gap-4 py-3">
                {flavor.image ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-100">
                    <Image src={flavor.image} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-zinc-900">{flavor.name}</p>
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
                  Edit →
                </Link>
              </li>
            ))}
          </ul>
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
  onSave,
  saving,
}: {
  flavor: LoadedTeaFlavorConfig;
  sizes: MegaTeasCatalogData['loadedTeas']['sizes'];
  backHref: string;
  onChange: (f: LoadedTeaFlavorConfig) => void;
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

function BowlCategoryAdmin({
  title,
  data,
  setData,
  typeHref,
  backHref,
  onSave,
  saving,
}: {
  title: string;
  data: BowlCategoryCatalogData;
  setData: (d: BowlCategoryCatalogData) => void;
  typeHref: (slug: string) => string;
  backHref: string;
  onSave: () => void;
  saving: boolean;
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
      <SectionCard title="Extra toppings default price ($)">
        <TextInput
          type="number"
          step="0.01"
          value={data.extraToppingDefaultPrice}
          onChange={(e) => setData({ ...data, extraToppingDefaultPrice: Number(e.target.value) })}
        />
        {data.extraToppings.map((extra, index) => (
          <div key={extra.name} className="flex gap-2">
            <TextInput value={extra.name} disabled className="flex-1" />
            <TextInput
              type="number"
              step="0.01"
              value={extra.price}
              onChange={(e) => {
                const extraToppings = [...data.extraToppings];
                extraToppings[index] = { ...extra, price: Number(e.target.value) };
                setData({ ...data, extraToppings });
              }}
            />
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Bowl types">
        <ul className="divide-y divide-zinc-100">
          {data.types.map((type) => (
            <li key={type.slug} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold">{type.name}</p>
                <p className="text-sm text-zinc-600">${type.price.toFixed(2)}</p>
                <ItemStatusTags hidden={type.hidden} />
              </div>
              <Link href={typeHref(type.slug)} className="text-sm font-semibold text-orange-600">Edit →</Link>
            </li>
          ))}
        </ul>
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
  onSave,
  saving,
}: {
  type: BowlCategoryCatalogData['types'][number];
  fruits: string[];
  toppings: string[];
  extraPrice: number;
  backHref: string;
  onChange: (t: BowlCategoryCatalogData['types'][number]) => void;
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
        <ItemStatusTags hidden={type.hidden} onToggleHide={() => onChange({ ...type, hidden: !type.hidden })} />
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
      <SectionCard title="Iced sizes">
        {data.sizes.map((size, i) => (
          <div key={size.slug} className="flex gap-2">
            <TextInput value={size.name} disabled className="flex-1" />
            <TextInput
              type="number"
              step="0.01"
              value={size.price}
              onChange={(e) => {
                const sizes = [...data.sizes];
                sizes[i] = { ...size, price: Number(e.target.value) };
                setData({ ...data, sizes });
              }}
            />
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Flavors">
        {data.flavors.map((flavor, i) => (
          <div key={flavor.slug} className="grid gap-2 border-b border-zinc-100 pb-3 sm:grid-cols-2">
            <TextInput
              value={flavor.name}
              onChange={(e) => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, name: e.target.value };
                setData({ ...data, flavors });
              }}
            />
            <CatalogImageField
              label={`${flavor.name} photo`}
              value={flavor.image}
              onChange={(url) => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, image: url };
                setData({ ...data, flavors });
              }}
            />
            <ItemStatusTags
              hidden={flavor.hidden}
              onToggleHide={() => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, hidden: !flavor.hidden };
                setData({ ...data, flavors });
              }}
            />
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Add-ons">
        {data.addOns.map((addon, i) => (
          <div key={addon.slug} className="flex gap-2">
            <TextInput value={addon.name} className="flex-1" disabled />
            <TextInput
              type="number"
              step="0.01"
              value={addon.price}
              onChange={(e) => {
                const addOns = [...data.addOns];
                addOns[i] = { ...addon, price: Number(e.target.value) };
                setData({ ...data, addOns });
              }}
            />
          </div>
        ))}
      </SectionCard>
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
      <SectionCard title="Sizes">
        {data.sizes.map((size, i) => (
          <div key={size.slug} className="flex gap-2">
            <TextInput value={size.name} disabled />
            <TextInput
              type="number"
              step="0.01"
              value={size.price}
              onChange={(e) => {
                const sizes = [...data.sizes];
                sizes[i] = { ...size, price: Number(e.target.value) };
                setData({ ...data, sizes });
              }}
            />
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Flavors">
        {data.flavors.map((flavor, i) => (
          <div key={flavor.slug} className="grid gap-2 border-b border-zinc-100 pb-3 sm:grid-cols-3">
            <TextInput
              value={flavor.name}
              onChange={(e) => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, name: e.target.value };
                setData({ ...data, flavors });
              }}
            />
            <CatalogImageField
              label={`${flavor.name} photo`}
              value={flavor.image}
              onChange={(url) => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, image: url };
                setData({ ...data, flavors });
              }}
            />
            <ItemStatusTags
              hidden={flavor.hidden}
              onToggleHide={() => {
                const flavors = [...data.flavors];
                flavors[i] = { ...flavor, hidden: !flavor.hidden };
                setData({ ...data, flavors });
              }}
            />
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Add-ons">
        {data.addOns.map((addon, i) => (
          <div key={addon.slug} className="flex gap-2">
            <TextInput value={addon.name} disabled className="flex-1" />
            <TextInput
              type="number"
              step="0.01"
              value={addon.price}
              onChange={(e) => {
                const addOns = [...data.addOns];
                addOns[i] = { ...addon, price: Number(e.target.value) };
                setData({ ...data, addOns });
              }}
            />
          </div>
        ))}
      </SectionCard>
    </div>
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
      <SectionCard title="Birthday Cake & Crunchy Monkey">
        {data.presets.map((preset, i) => (
          <div key={preset.slug} className="space-y-2 border-b border-zinc-100 pb-4">
            <p className="font-semibold">{preset.name}</p>
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
            />
          </div>
        ))}
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
        <Field label="Extra topping price ($ each)">
          <TextInput
            type="number"
            step="0.01"
            value={data.buildYourOwn.extraToppingPrice}
            onChange={(e) =>
              setData({
                ...data,
                buildYourOwn: { ...data.buildYourOwn, extraToppingPrice: Number(e.target.value) },
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
        {data.buildYourOwn.toppingGroups.map((group, gi) => (
          <Field key={group.label} label={group.label}>
            <TextArea
              rows={2}
              value={group.items.join(', ')}
              onChange={(e) => {
                const toppingGroups = [...data.buildYourOwn.toppingGroups];
                toppingGroups[gi] = {
                  ...group,
                  items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                };
                setData({
                  ...data,
                  buildYourOwn: { ...data.buildYourOwn, toppingGroups },
                });
              }}
            />
          </Field>
        ))}
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
      <SectionCard title="Protein truffles — packs">
        <CatalogImageField
          label="Truffles photo"
          value={data.truffles.image}
          onChange={(url) => setData({ ...data, truffles: { ...data.truffles, image: url } })}
        />
        {data.truffles.packs.map((pack, i) => (
          <div key={pack.slug} className="flex flex-wrap gap-2">
            <TextInput value={pack.label} disabled className="flex-1" />
            <TextInput
              type="number"
              step="0.01"
              value={pack.price}
              onChange={(e) => {
                const packs = [...data.truffles.packs];
                packs[i] = { ...pack, price: Number(e.target.value) };
                setData({ ...data, truffles: { ...data.truffles, packs } });
              }}
            />
          </div>
        ))}
      </SectionCard>
      <SectionCard title="Mini donuts">
        <TextInput
          type="number"
          step="0.01"
          value={data.miniDonuts.packPrice}
          onChange={(e) =>
            setData({ ...data, miniDonuts: { ...data.miniDonuts, packPrice: Number(e.target.value) } })
          }
        />
        <CatalogImageField
          label="Mini donuts photo"
          value={data.miniDonuts.image}
          onChange={(url) => setData({ ...data, miniDonuts: { ...data.miniDonuts, image: url } })}
        />
        {data.miniDonuts.flavors.map((flavor, i) => (
          <TextInput
            key={flavor.slug}
            value={flavor.name}
            onChange={(e) => {
              const flavors = [...data.miniDonuts.flavors];
              flavors[i] = { ...flavor, name: e.target.value };
              setData({ ...data, miniDonuts: { ...data.miniDonuts, flavors } });
            }}
          />
        ))}
      </SectionCard>
      <SectionCard title="Pie in a cup">
        <CatalogImageField
          label="Pie in a cup main photo"
          value={data.pieInACup.mainImage}
          onChange={(url) => setData({ ...data, pieInACup: { ...data.pieInACup, mainImage: url } })}
        />
        {data.pieInACup.sizes.map((size, i) => (
          <div key={size.slug} className="flex gap-2">
            <TextInput value={size.name} disabled />
            <TextInput
              type="number"
              step="0.01"
              value={size.price}
              onChange={(e) => {
                const sizes = [...data.pieInACup.sizes];
                sizes[i] = { ...size, price: Number(e.target.value) };
                setData({ ...data, pieInACup: { ...data.pieInACup, sizes } });
              }}
            />
          </div>
        ))}
        {data.pieInACup.flavors.map((flavor, i) => (
          <div key={flavor.slug} className="grid gap-2 sm:grid-cols-2">
            <TextInput
              value={flavor.name}
              onChange={(e) => {
                const flavors = [...data.pieInACup.flavors];
                flavors[i] = { ...flavor, name: e.target.value };
                setData({ ...data, pieInACup: { ...data.pieInACup, flavors } });
              }}
            />
            <CatalogImageField
              label={`${flavor.name} photo`}
              value={flavor.image}
              onChange={(url) => {
                const flavors = [...data.pieInACup.flavors];
                flavors[i] = { ...flavor, image: url };
                setData({ ...data, pieInACup: { ...data.pieInACup, flavors } });
              }}
            />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
