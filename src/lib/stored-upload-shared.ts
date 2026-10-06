/** Client-safe helpers for Mongo-backed upload URLs (no mongoose/mongodb imports). */

export const STORED_UPLOAD_FOLDERS = ['products', 'gallery', 'pages', 'misc'] as const;

export type StoredUploadFolder = (typeof STORED_UPLOAD_FOLDERS)[number];

export const STORED_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

export function isStoredUploadFolder(value: string): value is StoredUploadFolder {
  return (STORED_UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function storedUploadPublicUrl(folder: StoredUploadFolder, filename: string): string {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseStoredUploadUrl(url: string): { folder: StoredUploadFolder; filename: string } | null {
  const trimmed = url.trim();
  if (!trimmed.startsWith('/api/uploads/')) {
    return null;
  }

  const parts = trimmed.replace(/^\/api\/uploads\//, '').split('/');
  if (parts.length !== 2) {
    return null;
  }

  const [folder, filename] = parts;
  if (!isStoredUploadFolder(folder) || !filename || filename.includes('..') || filename.includes('/')) {
    return null;
  }

  return { folder, filename };
}
