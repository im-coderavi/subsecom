import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { Bundle } from './models/Bundle';

const defaultBundles = [
  {
    name: 'Creator Bundle', price: 2399, originalPrice: 3399, savingPercent: 30,
    products: ['Midjourney Pro', 'Runway Gen-3 Pro', 'ChatGPT Plus'],
    toolsCount: 3, colorTheme: 'creator' as const,
    features: [
      'Perfect for designers, YouTubers, and videomakers',
      'High-fidelity cinematics & visual image processing',
      'All chat, video, and image requirements in one',
    ],
  },
  {
    name: 'Pro Bundle', price: 2299, originalPrice: 3499, savingPercent: 35,
    products: ['Claude 3.5 Sonoma', 'ChatGPT Plus', 'Gemini Advanced'],
    toolsCount: 3, colorTheme: 'pro' as const,
    features: [
      'The Holy Trinity of Conversational AI Assistants',
      'Compare outputs across LLMs instantly',
      'Maximize research capacity with over 1.2M token workspace',
    ],
  },
  {
    name: 'Ultimate Bundle', price: 2699, originalPrice: 4499, savingPercent: 40,
    products: ['ChatGPT Plus', 'Notion AI Pro', 'Suno AI Pro', 'Cursor Pro', 'ElevenLabs Pro'],
    toolsCount: 5, colorTheme: 'ultimate' as const,
    features: [
      'The complete developer and business operating suite',
      'Includes text, code, voice, databases, and audio tools',
      'Over ₹1800+ separate monthly SaaS cost saved instantly',
    ],
  },
];

async function run() {
  await connectDB();
  await Bundle.deleteMany({});
  await Bundle.insertMany(defaultBundles);
  console.log(`✓ Seeded ${defaultBundles.length} bundles`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Bundle seed failed:', err);
  process.exit(1);
});
