'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import { contactSchema, type ContactInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

export function ContactForm() {
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema) as never,
    defaultValues: { preferredContactMethod: 'email' },
  });

  const onSubmit = async (data: ContactInput) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, locale }),
    });
    if (!res.ok) {
      toast.error('Something went wrong. Please try again.');
      return;
    }
    toast.success(locale === 'es' ? 'Mensaje enviado' : 'Message sent');
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
      <Input label="Name" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Phone (optional)" {...register('phone')} error={errors.phone?.message} />
      <Input label="Subject" {...register('subject')} error={errors.subject?.message} />
      <Textarea label="Message" {...register('message')} error={errors.message?.message} />
      <Select
        label="Preferred contact method"
        options={[
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
        ]}
        {...register('preferredContactMethod')}
      />
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register('consent')} className="mt-1" />
        <span>I consent to be contacted about my inquiry.</span>
      </label>
      {errors.consent && <p className="text-sm text-coral">{errors.consent.message}</p>}
      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        Submit
      </Button>
    </form>
  );
}
