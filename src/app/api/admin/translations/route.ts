import { readFile } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/admin/require-admin';
import { writeAuditLog } from '@/lib/admin/audit';
import { jsonOk, handleApiError } from '@/lib/admin/response';
import { parseJsonBody } from '@/lib/admin/utils';
import { translationUpdateSchema } from '@/lib/validators/admin';
import { revalidateSiteContent } from '@/lib/revalidate-storefront';
import {
  applyOverrides,
  flattenKeys,
  getTranslationOverrides,
  saveTranslationOverrides,
} from '@/lib/translation-overrides';

export const runtime = 'nodejs';

const MESSAGES_DIR = path.join(process.cwd(), 'src', 'messages');

async function readBaseMessages(locale: 'en' | 'es'): Promise<Record<string, unknown>> {
  const content = await readFile(path.join(MESSAGES_DIR, `${locale}.json`), 'utf-8');
  return JSON.parse(content) as Record<string, unknown>;
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') === 'es' ? 'es' : 'en';
    const tree = applyOverrides(await readBaseMessages(locale), await getTranslationOverrides(locale));

    return jsonOk({ locale, translations: flattenKeys(tree), tree });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Edits are stored in MongoDB (the deployed filesystem is read-only) and merged over the JSON files at request time. */
export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    const data = translationUpdateSchema.parse(await parseJsonBody(request));

    const flatUpdates: Record<string, string> = {};
    for (const [key, value] of Object.entries(data.translations)) {
      if (typeof value === 'string') {
        flatUpdates[key] = value;
      }
    }

    await saveTranslationOverrides(data.locale, flatUpdates);
    revalidateSiteContent();

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
