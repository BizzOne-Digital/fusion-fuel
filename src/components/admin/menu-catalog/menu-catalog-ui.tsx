'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import LocalImageField from '@/components/admin/LocalImageField';
import { adminFetch } from '@/lib/admin/client';
import type { MenuCatalogCategorySlug, MenuCatalogDataBySlug } from '@/types/menu-catalog';

/** Upload to MongoDB-backed storage (same as product admin). */
export function CatalogImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
}) {
  return (
    <LocalImageField
      label={label}
      folder="products"
      value={value?.trim() || null}
      onChange={(url) => onChange(url ?? '')}
    />
  );
}

export function useMenuCatalog<S extends MenuCatalogCategorySlug>(categorySlug: S) {
  const [data, setData] = useState<MenuCatalogDataBySlug[S] | null>(null);
  const dataRef = useRef<MenuCatalogDataBySlug[S] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: res, error } = await adminFetch<{ data: MenuCatalogDataBySlug[S] }>(
      `/api/admin/menu-catalog/${categorySlug}`
    );
    if (error) toast.error(error);
    const loaded = res?.data ?? null;
    setData(loaded);
    dataRef.current = loaded;
    setLoading(false);
  }, [categorySlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (next?: MenuCatalogDataBySlug[S]) => {
    const payload = next ?? dataRef.current;
    if (!payload) {
      toast.error('Nothing to save');
      return false;
    }
    setSaving(true);
    const { error } = await adminFetch(`/api/admin/menu-catalog/${categorySlug}`, {
      method: 'PUT',
      body: JSON.stringify({ data: payload }),
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return false;
    }
    setData(payload);
    dataRef.current = payload;
    toast.success('Saved & synced to storefront');
    return true;
  };

  return { data, setData, loading, saving, save, reload: load };
}

export function SaveBar({
  saving,
  onSave,
  backHref,
  backLabel,
}: {
  saving: boolean;
  onSave: () => void;
  backHref: string;
  backLabel?: string;
}) {
  return (
    <div className="sticky top-0 z-10 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <Link href={backHref} className="text-sm font-medium text-orange-600 hover:underline">
        ← {backLabel ?? 'Back'}
      </Link>
      <button
        type="button"
        disabled={saving}
        onClick={onSave}
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

export function ItemStatusTags({
  hidden,
  onToggleHide,
  onDelete,
}: {
  hidden?: boolean;
  onToggleHide?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 self-start">
      {hidden ? (
        <span className="inline-flex shrink-0 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700">
          Hidden
        </span>
      ) : (
        <span className="inline-flex shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
          Visible
        </span>
      )}
      {onToggleHide ? (
        <button type="button" onClick={onToggleHide} className="text-xs font-semibold text-orange-600 hover:underline">
          {hidden ? 'Show' : 'Hide'}
        </button>
      ) : null}
      {onDelete ? (
        <button type="button" onClick={onDelete} className="text-xs font-semibold text-red-600 hover:underline">
          Delete
        </button>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm ${props.className ?? ''}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm ${props.className ?? ''}`}
    />
  );
}

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-500">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
