import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IMenuCatalog extends Document {
  categorySlug: string;
  data: Record<string, unknown>;
  updatedAt: Date;
  createdAt: Date;
}

const MenuCatalogSchema = new Schema<IMenuCatalog>(
  {
    categorySlug: { type: String, required: true, unique: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const MenuCatalog: Model<IMenuCatalog> =
  mongoose.models.MenuCatalog ?? mongoose.model<IMenuCatalog>('MenuCatalog', MenuCatalogSchema);

export default MenuCatalog;
