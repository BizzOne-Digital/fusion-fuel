import connectDB from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import type { AuditAction } from '@/types';
import type { Types } from 'mongoose';

export interface WriteAuditLogInput {
  action: AuditAction;
  entityType: string;
  entityId?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  userType?: 'admin' | 'customer' | 'system';
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(input: WriteAuditLogInput): Promise<void> {
  await connectDB();

  await AuditLog.create({
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    userId: input.userId,
    userType: input.userType ?? 'admin',
    changes: input.changes,
    metadata: input.metadata,
  });
}
