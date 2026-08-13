'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { loginSchema, type LoginInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { toast } from '@/components/ui/Toast';

export function LoginForm() {
  const t = useTranslations('account');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/account';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    const result = await signIn('customer-credentials', {
      ...data,
      redirect: false,
    });
    if (result?.error) {
      toast.error('Invalid email or password');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <Input label={t('email')} type="email" {...register('email')} error={errors.email?.message} />
      <Input label={t('password')} type="password" {...register('password')} error={errors.password?.message} />
      <Button type="submit" loading={isSubmitting} className="w-full">
        {t('loginButton')}
      </Button>
      <p className="text-center text-sm">
        <Link href="/account/forgot-password" className="text-pink hover:underline">
          {t('forgotPasswordLink')}
        </Link>
      </p>
      <p className="text-center text-sm text-grey">
        {t('noAccount')}{' '}
        <Link href="/account/register" className="text-pink hover:underline">
          {t('registerTitle')}
        </Link>
      </p>
    </form>
  );
}
