'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import FormField from '@/components/admin/FormField';
import type { UploadDirectory } from '@/lib/upload';

interface ImageUploadFieldProps {
  label: string;
  directory: UploadDirectory;
  value?: { url: string; alt: string; width?: number; height?: number } | null;
  onChange: (value: { url: string; alt: string; width?: number; height?: number } | null) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  error?: string;
}

export default function ImageUploadField({
  label,
  directory,
  value,
  onChange,
  altValue = '',
  onAltChange,
  error,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    const alt = altValue.trim() || file.name.replace(/\.[^.]+$/, '');
    if (!alt) {
      setUploadError('Alt text is required');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', directory);
      formData.append('alt', alt);

      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Upload failed');
      }

      onChange(data.image);
      onAltChange?.(data.image.alt);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <FormField label={label} error={error ?? uploadError ?? undefined}>
      <div className="space-y-3">
        {onAltChange && (
          <input
            type="text"
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Alt text for accessibility"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        )}

        {value?.url ? (
          <div className="relative inline-block">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-zinc-200">
              <Image src={value.url} alt={value.alt} fill className="object-cover" unoptimized />
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 transition-colors hover:border-orange-400 hover:bg-orange-50/30">
            <Upload className="mb-2 h-6 w-6 text-zinc-400" />
            <span className="text-sm text-zinc-600">
              {uploading ? 'Uploading…' : 'Click to upload image'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void handleUpload(file);
                }
              }}
            />
          </label>
        )}
      </div>
    </FormField>
  );
}
