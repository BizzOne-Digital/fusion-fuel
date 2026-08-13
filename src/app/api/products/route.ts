import { NextResponse } from 'next/server';
import { getPublishedProducts } from '@/lib/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get('featured') === 'true';
  const category = searchParams.get('category') ?? undefined;
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

  const products = await getPublishedProducts({ featured, categorySlug: category, limit });
  return NextResponse.json({ products });
}
