import { setRequestLocale, getTranslations } from 'next-intl/server';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'account' });

  return (
    <div className="mx-auto max-w-lg px-4 py-16 lg:px-6">
      <h1 className="font-display text-center text-5xl">{t('registerTitle')}</h1>
      <RegisterForm />
    </div>
  );
}
