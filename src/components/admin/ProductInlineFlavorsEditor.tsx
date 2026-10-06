'use client';

import LocalImageField from '@/components/admin/LocalImageField';
import FormField, { inputClassName, textareaClassName } from '@/components/admin/FormField';

export type InlineFlavorForm = {
  id?: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  imageUrl: string | null;
  imageAlt: string;
};

interface ProductInlineFlavorsEditorProps {
  locale: 'en' | 'es';
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  flavors: InlineFlavorForm[];
  onChange: (flavors: InlineFlavorForm[]) => void;
}

export default function ProductInlineFlavorsEditor({
  locale,
  enabled,
  onEnabledChange,
  flavors,
  onChange,
}: ProductInlineFlavorsEditorProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
        <input type="checkbox" checked={enabled} onChange={(e) => onEnabledChange(e.target.checked)} />
        This product has flavors
      </label>

      {enabled ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">
            Add each flavor with a name, optional description, and image. These appear on the product page for
            customers to choose.
          </p>
          {flavors.map((flavor, index) => (
            <div key={flavor.id ?? `new-flavor-${index}`} className="space-y-3 rounded-lg border border-zinc-100 p-4">
              <FormField label={`Flavor name (${locale.toUpperCase()})`} required>
                <input
                  className={inputClassName()}
                  value={flavor.name[locale]}
                  onChange={(e) =>
                    onChange(
                      flavors.map((entry, i) =>
                        i === index ? { ...entry, name: { ...entry.name, [locale]: e.target.value } } : entry
                      )
                    )
                  }
                />
              </FormField>
              <FormField label={`Description (${locale.toUpperCase()}) — optional`}>
                <textarea
                  className={textareaClassName()}
                  value={flavor.description[locale]}
                  onChange={(e) =>
                    onChange(
                      flavors.map((entry, i) =>
                        i === index
                          ? { ...entry, description: { ...entry.description, [locale]: e.target.value } }
                          : entry
                      )
                    )
                  }
                />
              </FormField>
              <LocalImageField
                label="Flavor image"
                folder="products"
                value={flavor.imageUrl}
                onChange={(url) =>
                  onChange(
                    flavors.map((entry, i) =>
                      i === index
                        ? {
                            ...entry,
                            imageUrl: url,
                            imageAlt: entry.imageAlt || entry.name.en || `Flavor ${index + 1}`,
                          }
                        : entry
                    )
                  )
                }
              />
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() => onChange(flavors.filter((_, i) => i !== index))}
              >
                Remove flavor
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-medium text-orange-600 hover:underline"
            onClick={() =>
              onChange([
                ...flavors,
                {
                  name: { en: '', es: '' },
                  description: { en: '', es: '' },
                  imageUrl: null,
                  imageAlt: '',
                },
              ])
            }
          >
            + Add flavor
          </button>
        </div>
      ) : null}
    </div>
  );
}
