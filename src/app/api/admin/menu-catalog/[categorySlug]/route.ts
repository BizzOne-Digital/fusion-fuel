import { requireAdmin } from '@/lib/admin/require-admin';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { getMenuCatalogData, saveMenuCatalogData } from '@/lib/menu-catalog/repository';
import { syncMenuCatalogToDatabase } from '@/lib/menu-catalog/sync';
import { isMenuCatalogCategorySlug } from '@/lib/menu-catalog/defaults';
import { getCanonicalAdminCategorySlug } from '@/lib/admin/category-slug';
import type { MenuCatalogCategorySlug, MenuCatalogDataBySlug } from '@/types/menu-catalog';

interface RouteContext {
  params: Promise<{ categorySlug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { categorySlug } = await context.params;
    const catalogSlug = getCanonicalAdminCategorySlug(categorySlug);
    if (!isMenuCatalogCategorySlug(catalogSlug)) {
      return jsonError('Unsupported category', 404);
    }
    const data = await getMenuCatalogData(catalogSlug as MenuCatalogCategorySlug);
    return jsonOk({ data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { categorySlug } = await context.params;
    const catalogSlug = getCanonicalAdminCategorySlug(categorySlug);
    if (!isMenuCatalogCategorySlug(catalogSlug)) {
      return jsonError('Unsupported category', 404);
    }
    const body = (await request.json()) as { data?: MenuCatalogDataBySlug[MenuCatalogCategorySlug] };
    if (!body.data) return jsonError('Missing data', 400);

    const slug = catalogSlug as MenuCatalogCategorySlug;
    await saveMenuCatalogData(slug, body.data);
    await syncMenuCatalogToDatabase(slug, body.data);

    return jsonOk({ data: body.data, saved: true });
  } catch (error) {
    return handleApiError(error);
  }
}
