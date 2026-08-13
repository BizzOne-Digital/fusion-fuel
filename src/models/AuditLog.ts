import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import type { AuditAction } from '@/types';

export interface IAuditLog extends Document {
  action: AuditAction;
  entityType: string;
  entityId?: Types.ObjectId;
  userId?: Types.ObjectId;
  userType?: 'admin' | 'customer' | 'system';
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'login', 'logout', 'publish', 'unpublish'],
      required: true,
    },
    entityType: { type: String, required: true, trim: true, index: true },
    entityId: { type: Schema.Types.ObjectId, index: true },
    userId: { type: Schema.Types.ObjectId, index: true },
    userType: {
      type: String,
      enum: ['admin', 'customer', 'system'],
      default: 'admin',
    },
    changes: {
      before: { type: Schema.Types.Mixed },
      after: { type: Schema.Types.Mixed },
    },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true }
);

AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ?? mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
