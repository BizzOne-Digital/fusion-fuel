import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm';

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 lg:px-6">
      <h1 className="font-display text-center text-5xl">{t('forgotPasswordTitle')}</h1>
      <ForgotPasswordForm />
    </div>
  );
}
