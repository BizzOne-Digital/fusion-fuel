'use client';

function formatApiError(json: Record<string, unknown>, status: number): string {
  const message = typeof json.error === 'string' ? json.error : 'Request failed';
  const details = json.details as { fieldErrors?: Record<string, string[]> } | undefined;
  const fieldMessages = details?.fieldErrors
    ? Object.entries(details.fieldErrors)
        .flatMap(([field, errors]) => errors.map((err) => `${field}: ${err}`))
        .join('; ')
    : '';

  if (fieldMessages) {
    return `${message} (${fieldMessages})`;
  }

  if (status === 401) {
    return 'Session expired — please sign in to admin again.';
  }

  return message;
}

export async function adminFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  let json: Record<string, unknown> = {};
  try {
    json = (await response.json()) as Record<string, unknown>;
  } catch {
    if (!response.ok) {
      return { error: `Request failed (${response.status})` };
    }
  }

  if (!response.ok) {
    return { error: formatApiError(json, response.status) };
  }

  return { data: json as T };
}

export function formatCents(cents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}
