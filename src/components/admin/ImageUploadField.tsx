'use client';

import { useState } from 'react';
import LocalImageField from '@/components/admin/LocalImageField';
import FormField from '@/components/admin/FormField';
import type { StoredUploadFolder } from '@/lib/stored-upload-shared';
import type { UploadDirectory } from '@/lib/upload';

interface ImageUploadFieldProps {
  label: string;
  directory?: UploadDirectory;
  folder?: StoredUploadFolder;
  value?: { url: string; alt: string; width?: number; height?: number } | null;
  onChange: (value: { url: string; alt: string; width?: number; height?: number } | null) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  error?: string;
}

function mapDirectoryToFolder(directory: UploadDirectory): StoredUploadFolder {
  if (directory === 'gallery') return 'gallery';
  if (directory === 'pages') return 'pages';
  if (directory === 'products') return 'products';
  return 'misc';
}

export default function ImageUploadField({
  label,
  directory = 'products',
  folder,
  value,
  onChange,
  altValue = '',
  onAltChange,
  error,
}: ImageUploadFieldProps) {
  const [alt, setAlt] = useState(altValue || value?.alt || '');

  const resolvedFolder = folder ?? mapDirectoryToFolder(directory);

  return (
    <div className="space-y-3">
      {onAltChange && (
        <FormField label="Image alt text">
          <input
            type="text"
            value={altValue || alt}
            onChange={(e) => {
              setAlt(e.target.value);
              onAltChange(e.target.value);
              if (value?.url) {
                onChange({ ...value, alt: e.target.value });
              }
            }}
            placeholder="Alt text for accessibility"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </FormField>
      )}

      <LocalImageField
        label={label}
        folder={resolvedFolder}
        value={value?.url ?? null}
        error={error}
        onChange={(url) => {
          if (!url) {
            onChange(null);
            return;
          }
          const altText = (onAltChange ? altValue : alt) || label;
          onChange({ url, alt: altText });
        }}
      />
    </div>
  );
}
