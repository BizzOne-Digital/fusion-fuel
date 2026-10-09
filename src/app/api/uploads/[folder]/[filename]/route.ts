import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/require-admin';
import { handleApiError } from '@/lib/admin/response';
import {
  deleteStoredUploadByUrl,
  getStoredUpload,
  isStoredUploadFolder,
  storedUploadPublicUrl,
  type StoredUploadFolder,
} from '@/lib/stored-upload';
import { bufferFromStoredUploadData } from '@/lib/stored-upload-buffer';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ folder: string; filename: string }>;
}

function sanitizeFilename(filename: string): string | null {
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return null;
  }
  return filename;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { folder, filename: rawFilename } = await context.params;
    const filename = sanitizeFilename(rawFilename);

    if (!filename || !isStoredUploadFolder(folder)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const doc = await getStoredUpload(folder as StoredUploadFolder, filename);
    if (!doc) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const body = bufferFromStoredUploadData(doc.data);
    if (!body || body.length === 0) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        'Content-Type': doc.mimeType,
        'Content-Length': String(body.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { folder, filename: rawFilename } = await context.params;
    const filename = sanitizeFilename(rawFilename);

    if (!filename || !isStoredUploadFolder(folder)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const deleted = await deleteStoredUploadByUrl(storedUploadPublicUrl(folder as StoredUploadFolder, filename));
    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
