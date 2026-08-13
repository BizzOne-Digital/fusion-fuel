import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/Button';

export default async function NotFoundPage() {
  const t = await getTranslations('common');

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl text-lime">404</p>
      <h1 className="font-display mt-4 text-4xl">{t('notFoundTitle')}</h1>
      <p className="mt-4 text-grey">{t('notFoundDescription')}</p>
      <Link href="/" className="mt-8">
        <Button>{t('goHome')}</Button>
      </Link>
    </div>
  );
}
