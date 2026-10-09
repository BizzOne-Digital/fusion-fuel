import { requireAdmin } from '@/lib/admin/require-admin';
import { jsonOk, jsonError, handleApiError } from '@/lib/admin/response';
import { getMenuCatalogData, saveMenuCatalogData } from '@/lib/menu-catalog/repository';
import { normalizeBowlCategoryData } from '@/lib/menu-catalog/bowl-catalog';
import { normalizeProteinCoffeeCatalogData } from '@/lib/menu-catalog/protein-coffee-catalog';
import { normalizeProteinShakesCatalogData } from '@/lib/menu-catalog/protein-shakes-catalog';
import { normalizeWafflesCatalogData } from '@/lib/menu-catalog/waffles-catalog';
import { normalizeProteinTreatsCatalogData } from '@/lib/menu-catalog/protein-treats-catalog';
import { syncMenuCatalogToDatabase } from '@/lib/menu-catalog/sync';
import { getDefaultMenuCatalogData, isMenuCatalogCategorySlug } from '@/lib/menu-catalog/defaults';
import type {
  BowlCategoryCatalogData,
  ProteinCoffeeCatalogData,
  ProteinShakesCatalogData,
  WafflesCatalogData,
  ProteinTreatsCatalogData,
} from '@/types/menu-catalog';
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
    const defaults = getDefaultMenuCatalogData(slug);
    let payload = body.data;
    if (slug === 'acai-bowls' || slug === 'protein-bowls') {
      payload = normalizeBowlCategoryData(
        body.data as BowlCategoryCatalogData,
        defaults as BowlCategoryCatalogData
      ) as MenuCatalogDataBySlug[MenuCatalogCategorySlug];
    } else if (slug === 'protein-coffee') {
      payload = normalizeProteinCoffeeCatalogData(
        body.data as ProteinCoffeeCatalogData,
        defaults as ProteinCoffeeCatalogData
      ) as MenuCatalogDataBySlug[MenuCatalogCategorySlug];
    } else if (slug === 'protein-shakes') {
      payload = normalizeProteinShakesCatalogData(
        body.data as ProteinShakesCatalogData,
        defaults as ProteinShakesCatalogData
      ) as MenuCatalogDataBySlug[MenuCatalogCategorySlug];
    } else if (slug === 'waffles') {
      payload = normalizeWafflesCatalogData(
        body.data as WafflesCatalogData,
        defaults as WafflesCatalogData
      ) as MenuCatalogDataBySlug[MenuCatalogCategorySlug];
    } else if (slug === 'protein-treats') {
      payload = normalizeProteinTreatsCatalogData(
        body.data as ProteinTreatsCatalogData,
        defaults as ProteinTreatsCatalogData
      ) as MenuCatalogDataBySlug[MenuCatalogCategorySlug];
    }
    await saveMenuCatalogData(slug, payload);
    await syncMenuCatalogToDatabase(slug, payload);

    return jsonOk({ data: payload, saved: true });
  } catch (error) {
    return handleApiError(error);
  }
}
