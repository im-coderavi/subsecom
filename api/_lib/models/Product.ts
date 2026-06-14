import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingPlan {
  months: number;
  price: number;
  label?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  logo: string;
  image?: string;
  badge?: string;
  category: string;
  shortDescription: string;
  description: string;
  monthlyPrice: number;
  originalPrice: number;
  plans: IPricingPlan[];
  deliveryTime: string;
  features: string[];
  deliveryMethod: string;
  rating: number;
  ratingCount: number;
  isActive: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String, required: true },
    image: { type: String },
    badge: { type: String },
    category: {
      type: String,
      required: true,
      enum: ['writing', 'chat', 'code', 'image', 'video', 'voice', 'productivity', 'design'],
    },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    monthlyPrice: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    plans: [{
      months: { type: Number, required: true, min: 1 },
      price:  { type: Number, required: true, min: 0 },
      label:  { type: String },
    }],
    deliveryTime: { type: String, required: true },
    features: [{ type: String }],
    deliveryMethod: { type: String, required: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ monthlyPrice: 1 });
ProductSchema.index({ name: 'text', shortDescription: 'text' });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
