import Link from 'next/link';
import { AdminStoredImage } from '@/components/admin/AdminStoredImage';
import AdminHeader from '@/components/admin/AdminHeader';
import { adminProductsCategoryHref } from '@/lib/admin/category-catalog';
import { richTextToPlainText } from '@/lib/utils';

type CategoryRow = {
  id: string;
  name: { en: string };
  slug: string;
  description?: { en: string };
  image?: { url: string; alt: string };
};

interface ProductsCategoryBrowseProps {
  categories: CategoryRow[];
}

export default function ProductsCategoryBrowse({ categories }: ProductsCategoryBrowseProps) {
  return (
    <div>
      <AdminHeader
        title="Products"
        description="Pick a menu category, then browse every active product in that collection."
      />

      <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
        {categories.map((category) => (
          <li key={category.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              {category.image?.url ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  <AdminStoredImage
                    src={category.image.url}
                    alt={category.image.alt || category.name.en}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-500">
                  {category.name.en.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-zinc-900">{category.name.en}</p>
                <p className="text-sm text-zinc-500">{category.slug}</p>
                {category.description?.en ? (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                    {richTextToPlainText(category.description.en)}
                  </p>
                ) : null}
              </div>
            </div>
            <Link
              href={adminProductsCategoryHref(category.slug)}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Browse products of this collection
            </Link>
          </li>
        ))}
      </ul>

      {categories.length === 0 ? (
        <p className="mt-6 text-zinc-500">No published categories yet. Add categories under Categories.</p>
      ) : null}
    </div>
  );
}
