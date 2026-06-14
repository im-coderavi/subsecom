import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
  productId?: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isBundle: boolean;
  logo?: string;
}

interface ICredential {
  service: string;
  email: string;
  password: string;
  instructions?: string;
}

export interface IOrder extends Document {
  user?: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  paymentMethod: 'card' | 'crypto' | 'upi';
  status: 'pending' | 'completed' | 'failed';
  credentials: ICredential[];
  utrNumber?: string;
  paymentProof?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    isBundle: { type: Boolean, default: false },
    logo: { type: String },
  },
  { _id: false }
);

const CredentialSchema = new Schema<ICredential>(
  {
    service: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    instructions: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String, required: true, lowercase: true },
    userName: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: { type: String },
    paymentMethod: { type: String, enum: ['card', 'crypto', 'upi'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    credentials: { type: [CredentialSchema], default: [] },
    utrNumber: { type: String },
    paymentProof: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ userEmail: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
