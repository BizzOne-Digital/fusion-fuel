import type { ReactNode } from 'react';
import { getLocalized, sanitizeHtml } from '@/lib/utils';
import type { PageSection } from '@/types';
import type { Locale } from '@/types';
import { SectionReveal } from '@/components/motion/SectionReveal';

interface PageSectionRendererProps {
  section: PageSection;
  locale: Locale;
}

export function PageSectionRenderer({ section, locale }: PageSectionRendererProps) {
  if (section.visible === false) return null;

  const themeClass =
    section.theme === 'dark'
      ? 'section-dark'
      : section.theme === 'accent'
        ? 'gradient-fuel text-ink'
        : section.theme === 'gradient'
          ? 'gradient-boost text-white'
          : section.theme === 'light'
            ? 'section-cream'
            : 'bg-white';

  let content: ReactNode = null;

  if (section.body) {
    content = (
      <div
        className="prose-brand max-w-none text-grey"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(getLocalized(section.body, locale)) }}
      />
    );
  }

  return (
    <SectionReveal>
      <section className={`overflow-x-clip py-16 ${themeClass}`}>
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {section.title && (
            <h2 className="font-display mb-6 text-4xl">{getLocalized(section.title, locale)}</h2>
          )}
          {content}
        </div>
      </section>
    </SectionReveal>
  );
}
