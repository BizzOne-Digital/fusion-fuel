'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale } from 'next-intl';
import { z } from 'zod';
import { EMAIL_REGEX } from '@/lib/constants';
import { CONTACT, MONTHLY_TEA_CLUB } from '@/lib/brand-content';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

const PLAN_BADGES = ['Starter', 'Most Popular', 'Best Value', 'Bulk'] as const;

const monthlyTeaClubSignupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(EMAIL_REGEX, 'Invalid email address'),
  phone: z.string().trim().min(7, 'Phone is required for club sign-up').max(30),
  message: z.string().trim().max(2000).optional(),
  preferredContactMethod: z.enum(['email', 'phone']).default('email'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted' }),
  }),
  website: z.string().max(0).optional(),
});

type MonthlyTeaClubSignupInput = z.infer<typeof monthlyTeaClubSignupSchema>;

export function MonthlyTeaClubJoinPanel() {
  const locale = useLocale();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [fulfillment, setFulfillment] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MonthlyTeaClubSignupInput>({
    resolver: zodResolver(monthlyTeaClubSignupSchema) as never,
    defaultValues: { preferredContactMethod: 'phone' },
  });

  const selectedPlanLabel =
    MONTHLY_TEA_CLUB.plans.find((plan) => plan.kits === selectedPlan)?.label ?? null;

  const onSubmit = async (data: MonthlyTeaClubSignupInput) => {
    if (!selectedPlan || !fulfillment) {
      toast.error(
        locale === 'es'
          ? 'Elige un plan y método de entrega.'
          : 'Please choose a plan and delivery method.'
      );
      return;
    }

    const fulfillmentLabel = MONTHLY_TEA_CLUB.fulfillmentOptions.find(
      (option) => option.slug === fulfillment
    )?.label;

    const subject = `Monthly Mega Tea Club — ${selectedPlanLabel}/month`;
    const message = [
      'Monthly Mega Tea Club sign-up request',
      '',
      `Plan: ${selectedPlanLabel} per month`,
      `Fulfillment: ${fulfillmentLabel}`,
      'Flavors: Monthly surprise (curated by Fusion Fuel & Boost Co.)',
      '',
      data.message?.trim() ? `Notes from customer:\n${data.message.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject,
        message,
        preferredContactMethod: data.preferredContactMethod,
        consent: data.consent,
        website: data.website,
        locale,
      }),
    });

    if (!res.ok) {
      toast.error(locale === 'es' ? 'Algo salió mal. Inténtalo de nuevo.' : 'Something went wrong. Please try again.');
      return;
    }

    toast.success(
      locale === 'es'
        ? '¡Solicitud enviada! Te contactaremos pronto.'
        : 'Sign-up request sent! We will contact you soon.'
    );
    reset();
    setSelectedPlan(null);
    setFulfillment('');
  };

  return (
    <div className="mt-20 lg:mt-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-pink">Choose Your Box</p>
        <h3 className="font-display mt-3 text-4xl text-carbon md:text-5xl">How Many Kits Per Month?</h3>
        <p className="mt-3 text-base text-grey">{MONTHLY_TEA_CLUB.surpriseNote}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MONTHLY_TEA_CLUB.plans.map((plan, index) => {
          const isSelected = selectedPlan === plan.kits;
          const isFeatured = plan.kits === 12;

          return (
            <button
              key={plan.slug}
              type="button"
              onClick={() => setSelectedPlan(plan.kits)}
              className={cn(
                'group relative flex flex-col rounded-[1.5rem] border p-6 text-center transition duration-300',
                isSelected
                  ? 'border-pink bg-pink/10 shadow-md ring-2 ring-pink/40'
                  : isFeatured
                    ? 'border-lime bg-lime/15 shadow-md hover:-translate-y-1'
                    : 'border-grey/15 bg-white shadow-sm hover:border-pink/30 hover:shadow-md'
              )}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {PLAN_BADGES[index]}
                </span>
              )}
              {!isFeatured && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-grey">
                  {PLAN_BADGES[index]}
                </span>
              )}
              <p
                className={cn(
                  'font-display mt-3 text-6xl leading-none',
                  isSelected || isFeatured ? 'text-pink' : 'text-carbon'
                )}
              >
                {plan.kits}
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-grey">Kits / Month</p>
              <p className="mt-4 text-xs leading-relaxed text-grey">{plan.label}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-pink">
                {isSelected
                  ? locale === 'es'
                    ? 'Seleccionado'
                    : 'Selected'
                  : locale === 'es'
                    ? 'Seleccionar'
                    : 'Select'}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-12 rounded-[1.75rem] border border-grey/15 bg-white p-6 shadow-sm md:p-8">
        <h4 className="font-display text-2xl text-carbon">
          {locale === 'es' ? 'Entrega o envío' : 'Delivery or Shipping'}
        </h4>
        <p className="mt-2 text-sm text-grey">
          {locale === 'es'
            ? 'Elige cómo quieres recibir tus kits cada mes.'
            : 'Choose how you would like to receive your kits each month.'}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {MONTHLY_TEA_CLUB.fulfillmentOptions.map((option) => {
            const isSelected = fulfillment === option.slug;
            return (
              <button
                key={option.slug}
                type="button"
                onClick={() => setFulfillment(option.slug)}
                className={cn(
                  'rounded-2xl border p-4 text-left transition',
                  isSelected
                    ? 'border-lime bg-lime/10 ring-2 ring-lime/40'
                    : 'border-grey/15 bg-cream/30 hover:border-pink/30'
                )}
              >
                <p className="font-semibold text-carbon">{option.label}</p>
                <p className="mt-2 text-sm text-grey">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-grey/15 bg-cream/30 p-6 md:p-8">
        <h4 className="font-display text-2xl text-carbon">{MONTHLY_TEA_CLUB.cta}</h4>
        <p className="mt-2 text-sm text-grey">{MONTHLY_TEA_CLUB.ctaDetail}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={locale === 'es' ? 'Nombre' : 'Name'} {...register('name')} error={errors.name?.message} />
            <Input
              label={locale === 'es' ? 'Teléfono' : 'Phone'}
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Textarea
            label={locale === 'es' ? 'Notas (opcional)' : 'Notes (optional)'}
            placeholder={
              locale === 'es'
                ? 'Alergias, preferencias de contacto, etc.'
                : 'Allergies, contact preferences, etc.'
            }
            {...register('message')}
            error={errors.message?.message}
          />
          <Select
            label={locale === 'es' ? 'Método de contacto preferido' : 'Preferred contact method'}
            options={[
              { value: 'phone', label: locale === 'es' ? 'Teléfono' : 'Phone' },
              { value: 'email', label: 'Email' },
            ]}
            {...register('preferredContactMethod')}
          />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register('consent')} className="mt-1" />
            <span>
              {locale === 'es'
                ? 'Acepto ser contactado sobre mi suscripción al club.'
                : 'I consent to be contacted about my club subscription.'}
            </span>
          </label>
          {errors.consent && <p className="text-sm text-coral">{errors.consent.message}</p>}

          {selectedPlan && fulfillment && (
            <p className="rounded-xl bg-white px-4 py-3 text-sm text-grey">
              {locale === 'es' ? 'Resumen: ' : 'Summary: '}
              <strong className="text-carbon">{selectedPlanLabel}</strong>
              {locale === 'es' ? ' por mes · sabores sorpresa · ' : ' per month · surprise flavors · '}
              <strong className="text-carbon">
                {MONTHLY_TEA_CLUB.fulfillmentOptions.find((option) => option.slug === fulfillment)?.label}
              </strong>
            </p>
          )}

          <Button type="submit" loading={isSubmitting} size="lg" className="w-full sm:w-auto">
            {locale === 'es' ? 'Enviar solicitud de suscripción' : 'Submit Sign-Up Request'}
          </Button>
        </form>

        <div className="mt-8 border-t border-grey/15 pt-6 text-sm text-grey">
          <p className="font-semibold text-carbon">
            {locale === 'es' ? '¿Prefieres escribirnos?' : 'Prefer to text or DM?'}
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              Phone:{' '}
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="font-semibold text-carbon hover:text-pink">
                {CONTACT.phone}
              </a>
            </li>
            <li>
              Email:{' '}
              <a href={`mailto:${CONTACT.email}`} className="font-semibold text-carbon hover:text-pink">
                {CONTACT.email}
              </a>
            </li>
            <li>
              Instagram:{' '}
              <a
                href={CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-carbon hover:text-pink"
              >
                {CONTACT.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
