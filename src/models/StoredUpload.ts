import mongoose, { Document, Model, Schema } from 'mongoose';

import { STORED_UPLOAD_FOLDERS, type StoredUploadFolder } from '@/lib/stored-upload-shared';

export const STORED_UPLOAD_FOLDER_VALUES = STORED_UPLOAD_FOLDERS;
export type { StoredUploadFolder };

export interface IStoredUpload extends Document {
  folder: StoredUploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const StoredUploadSchema = new Schema<IStoredUpload>(
  {
    folder: {
      type: String,
      required: true,
      enum: STORED_UPLOAD_FOLDER_VALUES,
    },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

const StoredUpload: Model<IStoredUpload> =
  mongoose.models.StoredUpload ?? mongoose.model<IStoredUpload>('StoredUpload', StoredUploadSchema);

export default StoredUpload;
