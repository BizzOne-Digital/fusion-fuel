import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm';

export default async function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 lg:px-6">
      <h1 className="font-display text-center text-5xl">{t('resetPasswordTitle')}</h1>
      <Suspense><ResetPasswordForm /></Suspense>
    </div>
  );
}
