'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import { Star } from 'lucide-react';
import { reviewSubmitSchema, type ReviewSubmitInput } from '@/lib/validators/testimonial';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

interface ReviewFormProps {
  onSuccess?: () => void;
}

export function ReviewForm({ onSuccess }: ReviewFormProps) {
  const locale = useLocale();
  const isEs = locale === 'es';
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewSubmitInput>({
    resolver: zodResolver(reviewSubmitSchema) as never,
    defaultValues: { rating: 0 },
  });

  const rating = watch('rating');

  const onSubmit = async (data: ReviewSubmitInput) => {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, locale }),
    });

    if (!res.ok) {
      toast.error(
        isEs ? 'Algo salió mal. Inténtalo de nuevo.' : 'Something went wrong. Please try again.'
      );
      return;
    }

    toast.success(
      isEs
        ? '¡Gracias! Tu reseña ya está publicada en la página de testimonios.'
        : 'Thank you! Your review is now live on the testimonials page.'
    );
    reset({ rating: 0 });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-5">
      <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

      <Input
        label={isEs ? 'Tu nombre' : 'Your name'}
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label={isEs ? 'Título o ubicación (opcional)' : 'Title or location (optional)'}
        placeholder={isEs ? 'ej. Cliente habitual, Austin TX' : 'e.g. Regular customer, Austin TX'}
        {...register('role')}
        error={errors.role?.message}
      />

      <div>
        <p className="mb-2 text-sm font-semibold text-carbon">
          {isEs ? 'Tu calificación' : 'Your rating'}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            const active = value <= (hoverRating || rating);
            return (
              <button
                key={value}
                type="button"
                className="rounded p-1 transition hover:scale-110"
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setValue('rating', value, { shouldValidate: true })}
                aria-label={`${value} star${value > 1 ? 's' : ''}`}
              >
                <Star
                  className={`h-8 w-8 ${active ? 'fill-lime text-lime' : 'text-grey/30'}`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
        {errors.rating && <p className="mt-1 text-sm text-coral">{errors.rating.message}</p>}
      </div>

      <Textarea
        label={isEs ? 'Tu reseña' : 'Your review'}
        placeholder={
          isEs
            ? 'Cuéntanos qué te gustó de Fusion Fuel...'
            : 'Tell us what you loved about Fusion Fuel...'
        }
        rows={5}
        {...register('quote')}
        error={errors.quote?.message}
      />

      <label className="flex items-start gap-2 text-sm text-grey">
        <input type="checkbox" {...register('consent')} className="mt-1" />
        <span>
          {isEs
            ? 'Acepto que mi reseña pueda publicarse en el sitio web después de la revisión.'
            : 'I agree that my review may be published on the website after review.'}
        </span>
      </label>
      {errors.consent && <p className="text-sm text-coral">{errors.consent.message}</p>}

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {isEs ? 'Enviar reseña' : 'Submit Review'}
      </Button>
    </form>
  );
}
