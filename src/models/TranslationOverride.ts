import mongoose, { Model, Schema } from 'mongoose';

export interface ITranslationOverride {
  locale: 'en' | 'es';
  /** Dotted message keys, e.g. { key: "home.hero.title", value: "Hello" } (array: Mongo field names cannot hold dots safely). */
  overrides: { key: string; value: string }[];
  updatedAt: Date;
}

const TranslationOverrideSchema = new Schema<ITranslationOverride>(
  {
    locale: { type: String, required: true, enum: ['en', 'es'], unique: true },
    overrides: {
      type: [new Schema({ key: { type: String, required: true }, value: { type: String, default: '' } }, { _id: false })],
      default: [],
    },
  },
  { timestamps: true }
);

const TranslationOverride: Model<ITranslationOverride> =
  mongoose.models.TranslationOverride ??
  mongoose.model<ITranslationOverride>('TranslationOverride', TranslationOverrideSchema);

export default TranslationOverride;
