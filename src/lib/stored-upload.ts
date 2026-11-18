import 'server-only';

import { randomBytes } from 'crypto';
import connectDB from '@/lib/mongodb';
import StoredUpload from '@/models/StoredUpload';
import {
  STORED_UPLOAD_MAX_BYTES,
  parseStoredUploadUrl,
  storedUploadPublicUrl,
  type StoredUploadFolder,
} from '@/lib/stored-upload-shared';

export {
  STORED_UPLOAD_FOLDERS,
  STORED_UPLOAD_MAX_BYTES,
  isStoredUploadFolder,
  parseStoredUploadUrl,
  storedUploadPublicUrl,
  type StoredUploadFolder,
} from '@/lib/stored-upload-shared';

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function extensionForMime(mimeType: string): string | null {
  return ALLOWED_MIME_TYPES[mimeType] ?? null;
}

export function validateStoredUploadFile(file: File): void {
  if (!extensionForMime(file.type)) {
    throw new Error('Unsupported file type. Use JPEG, PNG, WebP, or GIF.');
  }

  if (file.size > STORED_UPLOAD_MAX_BYTES) {
    throw new Error('File exceeds maximum upload size (8MB).');
  }
}

function matchesImageSignature(buf: Buffer, mimeType: string): boolean {
  if (buf.length < 12) return false;
  switch (mimeType) {
    case 'image/jpeg':
      return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case 'image/png':
      return buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case 'image/gif':
      return buf.subarray(0, 4).toString('ascii') === 'GIF8';
    case 'image/webp':
      return buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP';
    default:
      return false;
  }
}

function buildStoredUploadFilename(mimeType: string): string {
  const ext = extensionForMime(mimeType);
  if (!ext) {
    throw new Error('Unsupported file type');
  }
  return `${Date.now()}-${randomBytes(8).toString('hex')}.${ext}`;
}

export async function saveStoredUpload(options: {
  folder: StoredUploadFolder;
  file: File;
}): Promise<{ url: string; filename: string; size: number; folder: StoredUploadFolder }> {
  validateStoredUploadFile(options.file);

  const buffer = Buffer.from(await options.file.arrayBuffer());
  if (!matchesImageSignature(buffer, options.file.type)) {
    throw new Error('File content does not match its image type.');
  }
  const filename = buildStoredUploadFilename(options.file.type);

  await connectDB();

  await StoredUpload.create({
    folder: options.folder,
    filename,
    mimeType: options.file.type,
    size: buffer.length,
    data: buffer,
  });

  return {
    url: storedUploadPublicUrl(options.folder, filename),
    filename,
    size: buffer.length,
    folder: options.folder,
  };
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseStoredUploadUrl(url);
  if (!parsed) {
    return false;
  }

  await connectDB();
  const result = await StoredUpload.deleteOne({ folder: parsed.folder, filename: parsed.filename });
  return result.deletedCount > 0;
}

export async function getStoredUpload(folder: StoredUploadFolder, filename: string) {
  if (filename.includes('..') || filename.includes('/')) {
    return null;
  }

  await connectDB();
  return StoredUpload.findOne({ folder, filename }).lean();
}

/** Collect every Mongo-backed upload URL (`/api/uploads/...`) found anywhere inside a document. */
export function collectStoredUploadUrls(value: unknown): Set<string> {
  const urls = new Set<string>();
  let plain: unknown;
  try {
    plain = JSON.parse(JSON.stringify(value ?? null));
  } catch {
    return urls;
  }

  const walk = (node: unknown) => {
    if (typeof node === 'string') {
      if (parseStoredUploadUrl(node)) urls.add(node.trim());
    } else if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      Object.values(node as Record<string, unknown>).forEach(walk);
    }
  };
  walk(plain);
  return urls;
}

/**
 * Delete uploads that were referenced by `before` but are no longer referenced by `after`.
 * Call this only AFTER the parent document was saved (or deleted: omit `after`).
 * Never throws: a cleanup failure must not fail the admin save.
 */
export async function deleteUnusedStoredUploads(before: unknown, after?: unknown): Promise<void> {
  try {
    const kept = collectStoredUploadUrls(after);
    for (const url of collectStoredUploadUrls(before)) {
      if (!kept.has(url)) {
        await deleteStoredUploadByUrl(url);
      }
    }
  } catch (error) {
    console.error('Stored upload cleanup failed', error);
  }
}
