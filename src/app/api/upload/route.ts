import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadImage, UPLOAD_DIRECTORIES, type UploadDirectory } from '@/lib/upload';

export const runtime = 'nodejs';

function isUploadDirectory(value: string): value is UploadDirectory {
  return (UPLOAD_DIRECTORIES as readonly string[]).includes(value);
}

export async function POST(request: Request): Promise<Response> {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const directory = formData.get('directory');
    const alt = formData.get('alt');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (typeof directory !== 'string' || !isUploadDirectory(directory)) {
      return NextResponse.json({ error: 'Invalid upload directory' }, { status: 400 });
    }

    if (typeof alt !== 'string' || alt.trim().length === 0) {
      return NextResponse.json({ error: 'Alt text is required' }, { status: 400 });
    }

    const uploaded = await uploadImage({
      file,
      directory,
      alt,
    });

    return NextResponse.json({ image: uploaded }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
