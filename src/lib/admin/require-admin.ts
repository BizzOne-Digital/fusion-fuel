import { auth } from '@/lib/auth';

export class AdminAuthError extends Error {
  status: number;

  constructor(message = 'Unauthorized', status = 401) {
    super(message);
    this.status = status;
  }
}

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    throw new AdminAuthError();
  }

  return session;
}
