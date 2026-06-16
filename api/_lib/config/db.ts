import mongoose from 'mongoose';
import { requireEnv } from './env';

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(requireEnv('MONGODB_URI'));
  console.log('MongoDB connected');
}
