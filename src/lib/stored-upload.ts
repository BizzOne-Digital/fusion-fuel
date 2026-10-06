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
