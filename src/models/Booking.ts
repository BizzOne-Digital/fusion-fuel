import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import { EMAIL_REGEX } from '@/lib/constants';
import type { BookingStatus } from '@/types';

export interface IBooking extends Document {
  referenceNumber: string;
  customerId?: Types.ObjectId;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  companyName?: string;
  eventType: string;
  eventDate: Date;
  eventStartTime: string;
  eventEndTime?: string;
  guestCount: number;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venueZip: string;
  serviceType: string;
  menuPreferences?: string;
  dietaryRestrictions?: string[];
  beveragePackage?: string;
  setupRequirements?: string;
  specialRequests?: string;
  estimatedBudget?: number;
  depositAmount?: number;
  depositPaid: boolean;
  internalNotes?: string;
  status: BookingStatus;
  confirmedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', index: true },
    contactName: { type: String, required: true, trim: true, maxlength: 120 },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_REGEX, 'Invalid email address'],
    },
    contactPhone: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, maxlength: 200 },
    eventType: { type: String, required: true, trim: true },
    eventDate: { type: Date, required: true, index: true },
    eventStartTime: { type: String, required: true, trim: true },
    eventEndTime: { type: String, trim: true },
    guestCount: { type: Number, required: true, min: 1 },
    venueName: { type: String, required: true, trim: true },
    venueAddress: { type: String, required: true, trim: true },
    venueCity: { type: String, required: true, trim: true },
    venueState: { type: String, required: true, trim: true },
    venueZip: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    menuPreferences: { type: String, trim: true, maxlength: 2000 },
    dietaryRestrictions: [{ type: String, trim: true }],
    beveragePackage: { type: String, trim: true },
    setupRequirements: { type: String, trim: true, maxlength: 2000 },
    specialRequests: { type: String, trim: true, maxlength: 2000 },
    estimatedBudget: { type: Number, min: 0 },
    depositAmount: { type: Number, min: 0 },
    depositPaid: { type: Boolean, default: false },
    internalNotes: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true },
  },
  { timestamps: true }
);

BookingSchema.index({ referenceNumber: 1 }, { unique: true });
BookingSchema.index({ status: 1, eventDate: 1 });
BookingSchema.index({ contactEmail: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
