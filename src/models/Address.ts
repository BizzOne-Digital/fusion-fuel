import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IAddress extends Document {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  label: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    label: { type: String, required: true, trim: true, maxlength: 50 },
    street: { type: String, required: true, trim: true, maxlength: 200 },
    street2: { type: String, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    state: { type: String, required: true, trim: true, maxlength: 100 },
    zip: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, default: 'US', maxlength: 2 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AddressSchema.index({ customerId: 1, isDefault: 1 });

const Address: Model<IAddress> =
  mongoose.models.Address ?? mongoose.model<IAddress>('Address', AddressSchema);

export default Address;
