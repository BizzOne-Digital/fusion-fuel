import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AdminAuthError } from '@/lib/admin/require-admin';

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof AdminAuthError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    return jsonError('Validation failed', 422, error.flatten());
  }

  if (error instanceof Error) {
    return jsonError(error.message, 400);
  }

  return jsonError('Internal server error', 500);
}
