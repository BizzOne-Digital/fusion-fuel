import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getLocalized } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { getCategoryImage } from '@/lib/site-images';
import type { IProductCategory } from '@/models/ProductCategory';
import type { Locale } from '@/types';

interface HomeMenuCategoriesSectionProps {
  categories: IProductCategory[];
  locale: Locale;
}

export function HomeMenuCategoriesSection({ categories, locale }: HomeMenuCategoriesSectionProps) {
  return (
    <section className="section-lime py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="font-display text-center text-4xl md:text-5xl">
          {locale === 'es' ? 'Nuestro Menú' : 'Our Menu'}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-grey">
          {locale === 'es'
            ? 'Loaded Teas, kits Mega Tea, bowls de açaí, café con proteína y más.'
            : 'Loaded Teas, Mega Tea Kits, Açaí Bowls, Protein Coffee, and more.'}
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={String(cat._id)}
              href={`/menu?category=${cat.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
                <Image
                  src={getCategoryImage(cat.slug)}
                  alt={getLocalized(cat.name, locale)}
                  fill
                  className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 font-display text-2xl text-white">
                  {getLocalized(cat.name, locale)}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/menu">
            <Button size="lg">{locale === 'es' ? 'Ver menú' : 'View menu'}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
