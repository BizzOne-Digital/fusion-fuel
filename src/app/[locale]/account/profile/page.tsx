'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const t = useTranslations('account');

  if (!session?.user) return null;

  const profile = session.user as typeof session.user & { name?: string | null; email?: string | null };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 lg:px-6">
      <h1 className="font-display text-5xl">{t('profile')}</h1>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success('Profile updates will be available when connected to the profile API.');
        }}
      >
        <Input label={t('name')} defaultValue={profile.name ?? ''} readOnly />
        <Input label={t('email')} defaultValue={profile.email ?? ''} readOnly />
        <Button type="submit">{t('saveProfile')}</Button>
      </form>
    </div>
  );
}
