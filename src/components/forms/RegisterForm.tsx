'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { registerSchema, type RegisterInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { toast } from '@/components/ui/Toast';
import { useRouter } from '@/i18n/navigation';

export function RegisterForm() {
  const t = useTranslations('account');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    const res = await fetch('/api/account/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast.error('Registration failed');
      return;
    }
    toast.success('Account created. Please sign in.');
    router.push('/account/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <Input label={t('name')} {...register('name')} error={errors.name?.message} />
      <Input label={t('email')} type="email" {...register('email')} error={errors.email?.message} />
      <Input label={t('phone')} {...register('phone')} error={errors.phone?.message} />
      <Input label={t('password')} type="password" {...register('password')} error={errors.password?.message} />
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register('consent')} className="mt-1" />
        <span>{t('consentLabel')}</span>
      </label>
      {errors.consent && <p className="text-sm text-coral">{errors.consent.message}</p>}
      <Button type="submit" loading={isSubmitting} className="w-full">
        {t('registerButton')}
      </Button>
      <p className="text-center text-sm text-grey">
        {t('hasAccount')}{' '}
        <Link href="/account/login" className="text-pink hover:underline">
          {t('loginTitle')}
        </Link>
      </p>
    </form>
  );
}
