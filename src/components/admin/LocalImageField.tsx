'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { AdminStoredImage } from '@/components/admin/AdminStoredImage';
import { Upload } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import { parseStoredUploadUrl, type StoredUploadFolder } from '@/lib/stored-upload-shared';

interface LocalImageFieldProps {
  label: string;
  folder: StoredUploadFolder;
  value?: string | null;
  onChange: (url: string | null) => void;
  error?: string;
}

async function deleteStoredUploadClient(url: string): Promise<void> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) {
    return;
  }

  const response = await fetch(`/api/uploads/${parsed.folder}/${parsed.filename}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  });

  if (!response.ok && response.status !== 404) {
    const data = await response.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? 'Failed to remove image');
  }
}

export default function LocalImageField({ label, folder, value, onChange, error }: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const previousUrl = value?.trim() || null;
      if (previousUrl?.startsWith('/api/uploads/')) {
        await deleteStoredUploadClient(previousUrl);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (previousUrl) {
        formData.append('replaceUrl', previousUrl);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as { error?: string }).error ?? 'Upload failed');
      }

      const url = (data as { url?: string }).url;
      if (!url) {
        throw new Error('Upload did not return a URL');
      }

      onChange(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  async function handleRemove() {
    const current = value?.trim();
    if (!current) {
      onChange(null);
      return;
    }

    setUploading(true);
    try {
      if (current.startsWith('/api/uploads/')) {
        await deleteStoredUploadClient(current);
      }
      onChange(null);
      toast.success('Image removed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove image');
    } finally {
      setUploading(false);
    }
  }

  return (
    <FormField label={label} error={error}>
      <div className="space-y-3">
        {value ? (
          <div className="flex flex-wrap items-start gap-4">
            <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
              <AdminStoredImage src={value} alt="" fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
              >
                {uploading ? 'Working…' : 'Replace'}
              </button>
              <button
                type="button"
                disabled={uploading}
                onClick={() => void handleRemove()}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Remove
              </button>
              <p className="max-w-xs break-all text-xs text-zinc-500">{value}</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 transition-colors hover:border-orange-400 hover:bg-orange-50/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload className="mb-2 h-6 w-6 text-zinc-400" />
            <span className="text-sm text-zinc-600">{uploading ? 'Uploading…' : 'Choose image (JPEG, PNG, WebP, GIF)'}</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void uploadFile(file);
            }
          }}
        />
      </div>
    </FormField>
  );
}
