'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { checkoutSchema, type CheckoutInput } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CartSummary } from '@/components/cart/CartSummary';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/Toast';
import { Link } from '@/i18n/navigation';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema) as never,
    defaultValues: {
      fulfillmentMethod: 'pickup',
      shippingAddress: { name: '', street: '', city: '', state: '', zip: '', country: 'US' },
    },
  });

  const method = watch('fulfillmentMethod');

  const onSubmit = async (data: CheckoutInput) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, locale: window.location.pathname.split('/')[1] ?? 'en' }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      const message =
        typeof json.error === 'string'
          ? json.error
          : json.error?.formErrors?.[0] ?? 'Checkout failed';
      toast.error(message);
      return;
    }
    if (json.url) window.location.href = json.url;
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-5xl">{t('title')}</h1>
        <p className="mt-4 text-grey">Your cart is empty.</p>
        <Link href="/menu" className="mt-8 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Cart', href: '/cart' },
          { label: t('title') },
        ]}
      />
      <h1 className="font-display text-5xl">{t('title')}</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,340px)]"
      >
        <div className="space-y-4">
          <Input label={t('email')} type="email" {...register('email')} error={errors.email?.message} />
          <Select
            label={t('fulfillment')}
            options={[
              { value: 'pickup', label: t('pickupLocation') },
              { value: 'shipping', label: t('shippingMethod') },
            ]}
            {...register('fulfillmentMethod')}
          />
          {method === 'pickup' && (
            <Input
              label={t('pickupLocation')}
              {...register('pickupLocationName')}
              error={errors.pickupLocationName?.message}
            />
          )}
          {method === 'shipping' && (
            <>
              <Input
                label="Name"
                {...register('shippingAddress.name')}
                error={errors.shippingAddress?.name?.message}
              />
              <Input
                label="Street"
                {...register('shippingAddress.street')}
                error={errors.shippingAddress?.street?.message}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  {...register('shippingAddress.city')}
                  error={errors.shippingAddress?.city?.message}
                />
                <Input
                  label="State"
                  {...register('shippingAddress.state')}
                  error={errors.shippingAddress?.state?.message}
                />
              </div>
              <Input
                label="ZIP"
                {...register('shippingAddress.zip')}
                error={errors.shippingAddress?.zip?.message}
              />
            </>
          )}
          <Textarea label={t('notes')} {...register('customerNotes')} />
          <p className="text-sm text-grey">{t('securePayment')}</p>
          <Button type="submit" loading={loading}>
            {t('placeOrder')}
          </Button>
        </div>
        <aside className="rounded-2xl border border-grey/15 bg-cream p-6">
          <h2 className="font-display text-xl">{t('orderSummary')}</h2>
          <div className="mt-4">
            <CartSummary />
          </div>
        </aside>
      </form>
    </div>
  );
}
