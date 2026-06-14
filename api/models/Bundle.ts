import mongoose, { Schema, Document } from 'mongoose';

export interface IBundle extends Document {
  name: string;
  price: number;
  originalPrice: number;
  savingPercent: number;
  products: string[];
  toolsCount: number;
  colorTheme: 'creator' | 'pro' | 'ultimate';
  features: string[];
  isActive: boolean;
}

const BundleSchema = new Schema<IBundle>(
  {
    name:          { type: String, required: true, trim: true },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    savingPercent: { type: Number, required: true, min: 0, max: 100 },
    products:      [{ type: String }],
    toolsCount:    { type: Number, required: true, min: 1 },
    colorTheme:    { type: String, enum: ['creator', 'pro', 'ultimate'], default: 'creator' },
    features:      [{ type: String }],
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Bundle = mongoose.model<IBundle>('Bundle', BundleSchema);
