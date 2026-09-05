'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import type { Locale } from '@/types';

const STEPS = ['Event', 'Schedule', 'Venue', 'Contact', 'Details', 'Review', 'Done'] as const;

const PRODUCT_INTEREST_LABELS: Record<string, string> = {
  'mega-tea-kits': 'Mega Tea Kits',
  catering: 'Catering',
};

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

function formatReviewTime(value?: string): string {
  if (!value) return '—';
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours)) return value;
  const date = new Date();
  date.setHours(hours, minutes ?? 0, 0, 0);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
      toast.error(json.error ?? 'Submission failed');
      return;
    }
    setReference(json.referenceNumber);
    setStep(6);
  };

  if (step === 6) {
    return (
      <div className="rounded-2xl border border-lime/30 bg-cream p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-pink">Request received</p>
        <h2 className="mt-2 font-display text-3xl text-carbon">Thank you!</h2>
        <p className="mt-4 text-grey">
          Your catering request has been submitted. Our team will review the details and follow up soon.
        </p>
        <p className="mt-6 rounded-xl bg-white px-4 py-3 text-sm text-carbon">
          Reference number: <strong className="font-display text-lg text-pink">{reference}</strong>
        </p>
        <p className="mt-3 text-xs text-grey">
          This is a request, not a confirmed booking. We will contact you to confirm availability.
        </p>
      </div>
    );
  }

  const selectedService = services.find((service) => service.slug === formData.serviceSlug);
  const serviceName = selectedService ? getLocalized(selectedService.name, locale) : formData.serviceSlug;
  const productInterests = (formData.productInterests ?? [])
    .map((interest) => PRODUCT_INTEREST_LABELS[interest] ?? interest)
    .join(', ');

  return (
    <div>
      <ol className="mb-8 flex flex-wrap gap-2">
        {STEPS.slice(0, 6).map((label, i) => (
          <li key={label} className={`rounded-full px-3 py-1 text-xs font-semibold ${i === step ? 'bg-lime text-ink' : 'bg-cream text-grey'}`}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <form onSubmit={handleSubmit((d) => { bookingStepEventSchema.parse(d); next(d); })} className="space-y-4">
          <Select label="Catering service" options={[{ value: '', label: 'Select…' }, ...services.map((s) => ({ value: s.slug, label: getLocalized(s.name, locale) }))]} {...register('serviceSlug')} error={errors.serviceSlug?.message} />
          <Input label="Event type" {...register('eventType')} error={errors.eventType?.message} />
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={handleSubmit((d) => { bookingStepScheduleSchema.parse(d); next(d); })} className="space-y-4">
          <Input label="Preferred date" type="date" {...register('preferredDate')} error={errors.preferredDate?.message} />
          <Input label="Alternate date (optional)" type="date" {...register('alternateDate')} />
          <Input label="Start time" type="time" {...register('startTime')} error={errors.startTime?.message} />
          <Input
            label="Guest count"
            type="number"
            min={BOOKING_GUEST_COUNT_MIN}
            max={BOOKING_GUEST_COUNT_MAX}
            placeholder={`${BOOKING_GUEST_COUNT_MIN}–${BOOKING_GUEST_COUNT_MAX}`}
            {...register('guestCount')}
            error={errors.guestCount?.message}
          />
          <p className="text-sm text-grey">
            Events are available for {BOOKING_GUEST_COUNT_MIN}–{BOOKING_GUEST_COUNT_MAX} guests.
          </p>
          <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit((d) => { bookingStepVenueSchema.parse(d); next(d); })} className="space-y-4">
          <Select label="Fulfillment" options={[{ value: 'delivery', label: 'Delivery' }, { value: 'pickup', label: 'Pickup' }]} {...register('fulfillmentMethod')} />
          <Input label="Venue name (optional)" {...register('venueName')} />
          <Input label="Street" {...register('street')} error={errors.street?.message} />
          <Input label="City" {...register('city')} error={errors.city?.message} />
          <Input label="State" {...register('state')} error={errors.state?.message} />
          <Input label="ZIP" {...register('zip')} error={errors.zip?.message} />
          <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit((d) => { bookingStepContactSchema.parse(d); next(d); })} className="space-y-4">
          <Input label="Contact name" {...register('contactName')} error={errors.contactName?.message} />
          <Input label="Organization (optional)" {...register('organization')} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
          <Select label="Preferred contact" options={[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }]} {...register('preferredContactMethod')} />
          <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit((d) => {
          const merged = { ...d, productInterests: ['mega-tea-kits', 'catering'] };
          bookingStepDetailsSchema.parse(merged);
          next(merged);
        })} className="space-y-4">
          <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
          <Textarea label="Dietary notes" {...register('dietaryNotes')} />
          <Input label="Budget range (optional)" {...register('budgetRange')} />
          <Textarea label="Special instructions" {...register('specialInstructions')} />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register('consent')} />
            <span>I consent to be contacted about this catering request.</span>
          </label>
          {errors.consent && <p className="text-sm text-coral">{errors.consent.message}</p>}
          <Button type="button" variant="outline" onClick={() => setStep(3)}>Back</Button>
          <Button type="submit">Next</Button>
        </form>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-3xl text-carbon">Review your request</h2>
            <p className="mt-2 text-sm text-grey">
              Please confirm your catering details before submitting.
            </p>
          </div>

          <ReviewSection title="Event">
            <ReviewField label="Catering service" value={serviceName} />
            <ReviewField label="Event type" value={formData.eventType} />
          </ReviewSection>

          <ReviewSection title="Schedule">
            <ReviewField label="Preferred date" value={formatReviewDate(formData.preferredDate, locale)} />
            <ReviewField label="Alternate date" value={formatReviewDate(formData.alternateDate, locale)} />
            <ReviewField label="Start time" value={formatReviewTime(formData.startTime)} />
            <ReviewField label="Guest count" value={formData.guestCount} />
          </ReviewSection>

          <ReviewSection title="Venue">
            <ReviewField
              label="Fulfillment"
              value={formData.fulfillmentMethod === 'pickup' ? 'Pickup' : 'Delivery'}
            />
            <ReviewField label="Venue name" value={formData.venueName} />
            <ReviewField label="Street" value={formData.street} />
            <ReviewField label="City" value={formData.city} />
            <ReviewField label="State" value={formData.state} />
            <ReviewField label="ZIP" value={formData.zip} />
          </ReviewSection>

          <ReviewSection title="Contact">
            <ReviewField label="Contact name" value={formData.contactName} />
            <ReviewField label="Organization" value={formData.organization} />
            <ReviewField label="Email" value={formData.email} />
            <ReviewField label="Phone" value={formData.phone} />
            <ReviewField
              label="Preferred contact"
              value={formData.preferredContactMethod === 'phone' ? 'Phone' : 'Email'}
            />
          </ReviewSection>

          <ReviewSection title="Details">
            <ReviewField label="Product interests" value={productInterests} />
            <ReviewField label="Dietary notes" value={formData.dietaryNotes} />
            <ReviewField label="Budget range" value={formData.budgetRange} />
            <ReviewField label="Special instructions" value={formData.specialInstructions} />
          </ReviewSection>

          <div className="flex flex-wrap gap-3 border-t border-grey/15 pt-6">
            <Button type="button" variant="outline" onClick={() => setStep(4)}>
              Back
            </Button>
            <Button loading={loading} onClick={submit}>
              Submit Request
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
