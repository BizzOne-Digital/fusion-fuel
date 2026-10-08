'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocale } from 'next-intl';
import {
  bookingStepEventSchema,
  bookingStepScheduleSchema,
  bookingStepVenueSchema,
  bookingStepContactSchema,
  bookingStepDetailsSchema,
  BOOKING_GUEST_COUNT_MIN,
  BOOKING_GUEST_COUNT_MAX,
  type BookingInput,
} from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import type { IService } from '@/models/Service';
import { getLocalized } from '@/lib/utils';
import { getBookingWizardCopy } from '@/lib/marketing-i18n';
import type { Locale } from '@/types';

function formatReviewDate(value: unknown, locale: Locale): string {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(locale === 'es' ? 'es-US' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatReviewTime(value?: string, locale: Locale = 'en'): string {
  if (!value) return '—';
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours)) return value;
  const date = new Date();
  date.setHours(hours, minutes ?? 0, 0, 0);
  return date.toLocaleTimeString(locale === 'es' ? 'es-US' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-grey/15 bg-white p-5 shadow-sm">
      <h3 className="font-display text-xl text-carbon">{title}</h3>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function ReviewField({ label, value }: { label: string; value?: string | number | null }) {
  const display = value != null && String(value).trim() !== '' ? String(value) : '—';
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-grey">{label}</dt>
      <dd className="mt-1 text-sm text-carbon">{display}</dd>
    </div>
  );
}

interface BookingWizardProps {
  services: IService[];
}

export function BookingWizard({ services }: BookingWizardProps) {
  const locale = useLocale() as Locale;
  const copy = getBookingWizardCopy(locale);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<BookingInput>>({});
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingInput>();

  const next = (data: Partial<BookingInput>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setLoading(true);
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, locale }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(json.error ?? copy.submissionFailed);
      return;
    }
    setReference(json.referenceNumber);
    setStep(6);
  };

  if (step === 6) {
    return (
      <div className="rounded-2xl border border-lime/30 bg-cream p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-pink">{copy.requestReceived}</p>
        <h2 className="mt-2 font-display text-3xl text-carbon">{copy.thankYou}</h2>
        <p className="mt-4 text-grey">{copy.submittedMessage}</p>
        <p className="mt-6 rounded-xl bg-white px-4 py-3 text-sm text-carbon">
          {copy.referenceLabel} <strong className="font-display text-lg text-pink">{reference}</strong>
        </p>
        <p className="mt-3 text-xs text-grey">{copy.notConfirmed}</p>
      </div>
    );
  }

  const selectedService = services.find((service) => service.slug === formData.serviceSlug);
  const serviceName = selectedService ? getLocalized(selectedService.name, locale) : formData.serviceSlug;
  const interestLabels = copy.productInterestLabels as Record<string, string>;
  const productInterests = (formData.productInterests ?? [])
    .map((interest) => interestLabels[interest] ?? interest)
    .join(', ');

  return (
    <div>
      <ol className="mb-8 flex flex-wrap gap-2">
        {copy.steps.slice(0, 6).map((label, i) => (
          <li key={label} className={`rounded-full px-3 py-1 text-xs font-semibold ${i === step ? 'bg-lime text-ink' : 'bg-cream text-grey'}`}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <form onSubmit={handleSubmit((d) => { bookingStepEventSchema.parse(d); next(d); })} className="space-y-4">
          <Select label={copy.cateringService} options={[{ value: '', label: copy.selectPlaceholder }, ...services.map((s) => ({ value: s.slug, label: getLocalized(s.name, locale) }))]} {...register('serviceSlug')} error={errors.serviceSlug?.message} />
          <Input label={copy.eventType} {...register('eventType')} error={errors.eventType?.message} />
          <Button type="submit">{copy.next}</Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={handleSubmit((d) => { bookingStepScheduleSchema.parse(d); next(d); })} className="space-y-4">
          <Input label={copy.preferredDate} type="date" {...register('preferredDate')} error={errors.preferredDate?.message} />
          <Input label={copy.alternateDate} type="date" {...register('alternateDate')} />
          <Input label={copy.startTime} type="time" {...register('startTime')} error={errors.startTime?.message} />
          <Input
            label={copy.guestCount}
            type="number"
            min={BOOKING_GUEST_COUNT_MIN}
            max={BOOKING_GUEST_COUNT_MAX}
            placeholder={`${BOOKING_GUEST_COUNT_MIN}–${BOOKING_GUEST_COUNT_MAX}`}
            {...register('guestCount')}
            error={errors.guestCount?.message}
          />
          <p className="text-sm text-grey">
            {copy.eventsGuestRangeLead} {BOOKING_GUEST_COUNT_MIN}–{BOOKING_GUEST_COUNT_MAX} {copy.eventsGuestRangeSuffix}
          </p>
          <Button type="button" variant="outline" onClick={() => setStep(0)}>{copy.back}</Button>
          <Button type="submit">{copy.next}</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit((d) => { bookingStepVenueSchema.parse(d); next(d); })} className="space-y-4">
          <Select label={copy.fulfillment} options={[{ value: 'delivery', label: copy.delivery }, { value: 'pickup', label: copy.pickup }]} {...register('fulfillmentMethod')} />
          <Input label={copy.venueName} {...register('venueName')} />
          <Input label={copy.street} {...register('street')} error={errors.street?.message} />
          <Input label={copy.city} {...register('city')} error={errors.city?.message} />
          <Input label={copy.state} {...register('state')} error={errors.state?.message} />
          <Input label={copy.zip} {...register('zip')} error={errors.zip?.message} />
          <Button type="button" variant="outline" onClick={() => setStep(1)}>{copy.back}</Button>
          <Button type="submit">{copy.next}</Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit((d) => { bookingStepContactSchema.parse(d); next(d); })} className="space-y-4">
          <Input label={copy.contactName} {...register('contactName')} error={errors.contactName?.message} />
          <Input label={copy.organization} {...register('organization')} />
          <Input label={copy.email} type="email" {...register('email')} error={errors.email?.message} />
          <Input label={copy.phone} {...register('phone')} error={errors.phone?.message} />
          <Select label={copy.preferredContact} options={[{ value: 'email', label: copy.email }, { value: 'phone', label: copy.phone }]} {...register('preferredContactMethod')} />
          <Button type="button" variant="outline" onClick={() => setStep(2)}>{copy.back}</Button>
          <Button type="submit">{copy.next}</Button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit((d) => {
          const merged = { ...d, productInterests: ['mega-tea-kits', 'catering'] };
          bookingStepDetailsSchema.parse(merged);
          next(merged);
        })} className="space-y-4">
          <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
          <Textarea label={copy.dietaryNotes} {...register('dietaryNotes')} />
          <Input label={copy.budgetRange} {...register('budgetRange')} />
          <Textarea label={copy.specialInstructions} {...register('specialInstructions')} />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register('consent')} />
            <span>{copy.consent}</span>
          </label>
          {errors.consent && <p className="text-sm text-coral">{errors.consent.message}</p>}
          <Button type="button" variant="outline" onClick={() => setStep(3)}>{copy.back}</Button>
          <Button type="submit">{copy.next}</Button>
        </form>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-3xl text-carbon">{copy.reviewTitle}</h2>
            <p className="mt-2 text-sm text-grey">{copy.reviewSubtitle}</p>
          </div>

          <ReviewSection title={copy.sectionEvent}>
            <ReviewField label={copy.cateringService} value={serviceName} />
            <ReviewField label={copy.eventType} value={formData.eventType} />
          </ReviewSection>

          <ReviewSection title={copy.sectionSchedule}>
            <ReviewField label={copy.preferredDate} value={formatReviewDate(formData.preferredDate, locale)} />
            <ReviewField label={copy.alternateDate} value={formatReviewDate(formData.alternateDate, locale)} />
            <ReviewField label={copy.startTime} value={formatReviewTime(formData.startTime, locale)} />
            <ReviewField label={copy.guestCount} value={formData.guestCount} />
          </ReviewSection>

          <ReviewSection title={copy.sectionVenue}>
            <ReviewField
              label={copy.fulfillment}
              value={formData.fulfillmentMethod === 'pickup' ? copy.pickup : copy.delivery}
            />
            <ReviewField label={copy.venueName} value={formData.venueName} />
            <ReviewField label={copy.street} value={formData.street} />
            <ReviewField label={copy.city} value={formData.city} />
            <ReviewField label={copy.state} value={formData.state} />
            <ReviewField label={copy.zip} value={formData.zip} />
          </ReviewSection>

          <ReviewSection title={copy.sectionContact}>
            <ReviewField label={copy.contactName} value={formData.contactName} />
            <ReviewField label={copy.organization} value={formData.organization} />
            <ReviewField label={copy.email} value={formData.email} />
            <ReviewField label={copy.phone} value={formData.phone} />
            <ReviewField
              label={copy.preferredContact}
              value={formData.preferredContactMethod === 'phone' ? copy.phone : copy.email}
            />
          </ReviewSection>

          <ReviewSection title={copy.sectionDetails}>
            <ReviewField label={copy.productInterests} value={productInterests} />
            <ReviewField label={copy.dietaryNotes} value={formData.dietaryNotes} />
            <ReviewField label={copy.budgetRange} value={formData.budgetRange} />
            <ReviewField label={copy.specialInstructions} value={formData.specialInstructions} />
          </ReviewSection>

          <div className="flex flex-wrap gap-3 border-t border-grey/15 pt-6">
            <Button type="button" variant="outline" onClick={() => setStep(4)}>
              {copy.back}
            </Button>
            <Button loading={loading} onClick={submit}>
              {copy.submit}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
