import { setRequestLocale, getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/forms/LoginForm';
import { Suspense } from 'react';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 lg:px-6">
      <h1 className="font-display text-center text-5xl">{t('loginTitle')}</h1>
      <Suspense><LoginForm /></Suspense>
    </div>
  );
}
