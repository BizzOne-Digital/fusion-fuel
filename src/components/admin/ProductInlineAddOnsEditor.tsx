'use client';

import FormField, { inputClassName, textareaClassName } from '@/components/admin/FormField';

export type InlineAddOnForm = {
  id?: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  priceDollars: string;
};

interface ProductInlineAddOnsEditorProps {
  locale: 'en' | 'es';
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  addOns: InlineAddOnForm[];
  onChange: (addOns: InlineAddOnForm[]) => void;
}

export default function ProductInlineAddOnsEditor({
  locale,
  enabled,
  onEnabledChange,
  addOns,
  onChange,
}: ProductInlineAddOnsEditorProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
        <input type="checkbox" checked={enabled} onChange={(e) => onEnabledChange(e.target.checked)} />
        This product has add-ons (extra paid options)
      </label>

      {enabled ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-500">
            Each add-on can have an optional description and an extra price added when the customer selects it.
          </p>
          {addOns.map((addOn, index) => (
            <div key={addOn.id ?? `new-addon-${index}`} className="space-y-3 rounded-lg border border-zinc-100 p-4">
              <FormField label={`Add-on name (${locale.toUpperCase()})`} required>
                <input
                  className={inputClassName()}
                  value={addOn.name[locale]}
                  onChange={(e) =>
                    onChange(
                      addOns.map((entry, i) =>
                        i === index ? { ...entry, name: { ...entry.name, [locale]: e.target.value } } : entry
                      )
                    )
                  }
                />
              </FormField>
              <FormField label={`Description (${locale.toUpperCase()}) — optional`}>
                <textarea
                  className={textareaClassName()}
                  value={addOn.description[locale]}
                  onChange={(e) =>
                    onChange(
                      addOns.map((entry, i) =>
                        i === index
                          ? { ...entry, description: { ...entry.description, [locale]: e.target.value } }
                          : entry
                      )
                    )
                  }
                />
              </FormField>
              <FormField label="Extra price (USD)" required>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  className={inputClassName()}
                  value={addOn.priceDollars}
                  onChange={(e) =>
                    onChange(
                      addOns.map((entry, i) => (i === index ? { ...entry, priceDollars: e.target.value } : entry))
                    )
                  }
                />
              </FormField>
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() => onChange(addOns.filter((_, i) => i !== index))}
              >
                Remove add-on
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-medium text-orange-600 hover:underline"
            onClick={() =>
              onChange([
                ...addOns,
                {
                  name: { en: '', es: '' },
                  description: { en: '', es: '' },
                  priceDollars: '0.00',
                },
              ])
            }
          >
            + Add add-on
          </button>
        </div>
      ) : null}
    </div>
  );
}
