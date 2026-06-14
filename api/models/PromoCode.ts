import mongoose, { Schema, Document } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const PromoCode = mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema);
