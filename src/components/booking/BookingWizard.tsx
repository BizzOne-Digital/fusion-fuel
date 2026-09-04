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
      <div className="rounded-2xl bg-cream p-8 text-center">
        <h2 className="font-display text-3xl">Request Received</h2>
        <p className="mt-4">Reference: <strong>{reference}</strong></p>
        <p className="mt-2 text-grey">This is a request, not a confirmed booking. Our team will follow up soon.</p>
      </div>
    );
  }

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
        <div className="space-y-4">
          <pre className="overflow-auto rounded-xl bg-cream p-4 text-sm">{JSON.stringify(formData, null, 2)}</pre>
          <Button type="button" variant="outline" onClick={() => setStep(4)}>Back</Button>
          <Button loading={loading} onClick={submit}>Submit Request</Button>
        </div>
      )}
    </div>
  );
}
