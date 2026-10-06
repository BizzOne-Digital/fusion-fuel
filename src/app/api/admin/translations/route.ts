import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parseJsonBody } from '@/lib/admin/utils';
import { translationUpdateSchema } from '@/lib/validators/admin';

const MESSAGES_DIR = path.join(process.cwd(), 'src', 'messages');

function flattenKeys(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (value && typeof value === 'object') {
      Object.assign(result, flattenKeys(value as Record<string, unknown>, fullKey));
    }
  }
  return result;
}

function unflattenKeys(flat: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') ?? 'en') as 'en' | 'es';
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content) as Record<string, unknown>;

    return jsonOk({
      locale,
      translations: flattenKeys(json),
      tree: json,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    const data = translationUpdateSchema.parse(await parseJsonBody(request));
    const filePath = path.join(MESSAGES_DIR, `${data.locale}.json`);

    const flatUpdates: Record<string, string> = {};
    for (const [key, value] of Object.entries(data.translations)) {
      if (typeof value === 'string') {
        flatUpdates[key] = value;
      }
    }

    const content = await readFile(filePath, 'utf-8');
    const existing = JSON.parse(content) as Record<string, unknown>;
    const merged = { ...existing, ...unflattenKeys(flatUpdates) };

    await writeFile(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf-8');

    await writeAuditLog({
      action: 'update',
      entityType: 'translations',
      userId: session.user.id,
      metadata: { locale: data.locale, keysUpdated: Object.keys(flatUpdates).length },
    });

    return jsonOk({ success: true, locale: data.locale });
  } catch (error) {
    return handleApiError(error);
  }
}
