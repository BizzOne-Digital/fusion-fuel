import { redirect } from '@/i18n/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/types';

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  redirect({ href: `/menu${query}`, locale: locale as Locale });
}