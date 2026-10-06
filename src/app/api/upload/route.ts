import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/require-admin';
import {
  deleteStoredUploadByUrl,
  isStoredUploadFolder,
  saveStoredUpload,
  type StoredUploadFolder,
} from '@/lib/stored-upload';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') ?? formData.get('directory');
    const replaceUrl = formData.get('replaceUrl');
    const alt = formData.get('alt');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (typeof folder !== 'string' || !isStoredUploadFolder(folder)) {
      return NextResponse.json({ error: 'Invalid upload folder' }, { status: 400 });
    }

    if (typeof replaceUrl === 'string' && replaceUrl.trim()) {
      await deleteStoredUploadByUrl(replaceUrl.trim());
    }

    const saved = await saveStoredUpload({ folder: folder as StoredUploadFolder, file });

    const altText =
      typeof alt === 'string' && alt.trim().length > 0
        ? alt.trim()
        : file.name.replace(/\.[^.]+$/, '');

    return NextResponse.json(
      {
        success: true,
        url: saved.url,
        filename: saved.filename,
        size: saved.size,
        folder: saved.folder,
        image: {
          url: saved.url,
          alt: altText,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
