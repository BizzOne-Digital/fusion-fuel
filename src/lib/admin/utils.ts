import { Types } from 'mongoose';

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 20)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function toObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID');
  }
  return new Types.ObjectId(id);
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  return request.json() as Promise<T>;
}
