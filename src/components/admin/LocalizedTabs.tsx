'use client';

interface LocalizedTabsProps {
  activeLocale: 'en' | 'es';
  onChange: (locale: 'en' | 'es') => void;
}

export default function LocalizedTabs({ activeLocale, onChange }: LocalizedTabsProps) {
  return (
    <div className="mb-4 inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
      {(['en', 'es'] as const).map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            activeLocale === locale
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          {locale === 'en' ? 'English' : 'Español'}
        </button>
      ))}
    </div>
  );
}
