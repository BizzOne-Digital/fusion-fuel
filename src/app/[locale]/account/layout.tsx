import type { Metadata } from 'next';
import { noIndexMetadata } from '@/lib/seo';
import type { Locale } from '@/types';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return noIndexMetadata(locale as Locale, 'Account');
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
