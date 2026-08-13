'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

export function ResetPasswordForm() {
  const t = useTranslations('account');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    const res = await fetch('/api/account/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      toast.error('Reset failed');
      return;
    }
    toast.success('Password updated');
    router.push('/account/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <input type="hidden" {...register('token')} />
      <Input label={t('password')} type="password" {...register('password')} error={errors.password?.message} />
      <Input label={t('confirmPassword')} type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
      <Button type="submit" loading={isSubmitting} className="w-full">{t('resetPasswordButton')}</Button>
    </form>
  );
}
