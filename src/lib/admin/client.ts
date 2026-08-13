'use client';

export async function adminFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const json = await response.json();
  if (!response.ok) {
    return { error: json.error ?? 'Request failed' };
  }
  return { data: json as T };
}

export function formatCents(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}
