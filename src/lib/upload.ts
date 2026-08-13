import { createHash } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { nanoid } from 'nanoid';

export const UPLOAD_DIRECTORIES = [
  'pages',
  'products',
  'services',
  'gallery',
  'blog',
  'testimonials',
  'settings',
] as const;

export type UploadDirectory = (typeof UPLOAD_DIRECTORIES)[number];

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 2400;

export interface UploadedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  filename: string;
}

export interface UploadImageOptions {
  file: File;
  directory: UploadDirectory;
  alt: string;
  maxWidth?: number;
  maxHeight?: number;
}

function getMaxFileSizeBytes(): number {
  const configured = process.env.UPLOAD_MAX_SIZE_MB;
  if (!configured) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  const parsed = Number(configured);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  return parsed * 1024 * 1024;
}

function sanitizeExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext) ? ext : '.webp';
}

function buildCollisionSafeFilename(originalName: string): string {
  const ext = sanitizeExtension(originalName);
  const hash = createHash('sha256')
    .update(`${originalName}-${Date.now()}-${nanoid(8)}`)
    .digest('hex')
    .slice(0, 16);

  return `${hash}${ext}`;
}

function assertSafeDirectory(directory: UploadDirectory): string {
  if (!UPLOAD_DIRECTORIES.includes(directory)) {
    throw new Error('Invalid upload directory');
  }

  const uploadsRoot = path.join(process.cwd(), 'public', 'uploads');
  const targetDir = path.join(uploadsRoot, directory);
  const normalized = path.normalize(targetDir);

  if (!normalized.startsWith(uploadsRoot)) {
    throw new Error('Invalid upload path');
  }

  return normalized;
}

export function validateUploadFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Unsupported file type');
  }

  if (file.size > getMaxFileSizeBytes()) {
    throw new Error('File exceeds maximum upload size');
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error('Unsupported file extension');
  }
}

export async function uploadImage(options: UploadImageOptions): Promise<UploadedImage> {
  validateUploadFile(options.file);

  const targetDir = assertSafeDirectory(options.directory);
  await mkdir(targetDir, { recursive: true });

  const filename = buildCollisionSafeFilename(options.file.name);
  const outputPath = path.join(targetDir, filename);

  if (!outputPath.startsWith(targetDir)) {
    throw new Error('Invalid output path');
  }

  const buffer = Buffer.from(await options.file.arrayBuffer());
  const maxWidth = options.maxWidth ?? MAX_DIMENSION;
  const maxHeight = options.maxHeight ?? MAX_DIMENSION;

  const processed = await sharp(buffer)
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const webpFilename = filename.replace(/\.[^.]+$/, '.webp');
  const webpOutputPath = path.join(targetDir, webpFilename);
  await writeFile(webpOutputPath, processed.data);

  return {
    url: `/uploads/${options.directory}/${webpFilename}`,
    alt: options.alt.trim(),
    width: processed.info.width,
    height: processed.info.height,
    filename: webpFilename,
  };
}

export function getPublicUploadPath(directory: UploadDirectory, filename: string): string {
  const safeName = path.basename(filename);
  return `/uploads/${directory}/${safeName}`;
}
