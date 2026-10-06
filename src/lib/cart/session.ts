import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

export const CART_SESSION_COOKIE = 'ffb_cart_session';
const CART_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function getCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_SESSION_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  return nanoid(32);
}

export function buildCartSessionCookie(sessionId: string): {
  name: string;
  value: string;
  httpOnly: boolean;
  sameSite: 'lax';
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    name: CART_SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: CART_SESSION_MAX_AGE,
  };
}
