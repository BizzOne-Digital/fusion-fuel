import mongoose, { Document, Model, Schema } from 'mongoose';
import { EMAIL_REGEX } from '@/lib/constants';
import type { ContactSubmissionStatus } from '@/types';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  source?: string;
  locale?: string;
  status: ContactSubmissionStatus;
  repliedAt?: Date;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Invalid email address'],
    },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    source: { type: String, trim: true, default: 'contact_form' },
    locale: { type: String, enum: ['en', 'es'], default: 'en' },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    repliedAt: { type: Date },
    adminNotes: { type: String, trim: true, maxlength: 2000 },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true }
);

ContactSubmissionSchema.index({ status: 1, createdAt: -1 });
ContactSubmissionSchema.index({ email: 1 });

const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ??
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);

export default ContactSubmission;
