import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db';
import { Product } from './models/Product';
import { PromoCode } from './models/PromoCode';
import { User } from './models/User';
import { Settings } from './models/Settings';
import { Bundle } from './models/Bundle';

const products = [
  {
    name: 'Claude 3.5 Sonoma', slug: 'claude-3-5', badge: 'Best Seller', category: 'chat',
    logo: 'Sparkles',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/200px-Claude_AI_logo.svg.png',
    shortDescription: 'Advanced AI assistant by Anthropic.',
    description: "Anthropic's Claude 3.5 Sonnet excels at coding, analysis, and writing tasks. Includes high-capacity tokens and fast-track processing times. Ideal for technical and academic research, complex programming tasks, and precise content generation.",
    monthlyPrice: 1299, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    features: ['200K Tokens Context Window', 'Advanced Coding & Reasoning Abilities', 'Claude Artifacts Access', 'No Message Cap limits', 'Dedicated Customer Support Escalation'],
    deliveryMethod: 'Shared Premium Access + Account Credentials provided via dashboard in 2-5 min.',
    rating: 4.9, ratingCount: 348,
  },
  {
    name: 'ChatGPT Plus', slug: 'chatgpt-plus', badge: 'Popular', category: 'chat',
    logo: 'MessageSquareCode',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/200px-ChatGPT_logo.svg.png',
    shortDescription: "The world's most powerful AI assistant.",
    description: 'ChatGPT Plus gives you access to GPT-4o, GPT-o1, GPT-o3-mini, and advanced analysis features. Perfect for everyday tasks, brainstorm sessions, translation, and custom GPT creations.',
    monthlyPrice: 1199, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    features: ['Access to GPT-4o and o1-pro models', 'DALL-E 3 Image Generation built-in', 'Custom GPT Explorers & Builders', 'Advanced Voice Mode', 'Web-browsing and coding sandbox tools'],
    deliveryMethod: 'Chrome Extension Auth Token / Direct Username and Password.',
    rating: 4.8, ratingCount: 512,
  },
  {
    name: 'Gemini Advanced', slug: 'gemini-pro', badge: 'Trending', category: 'chat',
    logo: 'Sparkle',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/200px-Google_Gemini_logo.svg.png',
    shortDescription: "Google's most powerful AI model.",
    description: "Get absolute premium privileges with Google Gemini Advanced (1.5 Pro). Offers unparalleled reasoning, extreme context size of up to 1 million tokens, and deep integrations with Google Workspace apps.",
    monthlyPrice: 999, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    features: ['1 Million+ tokens context size', 'Google Workspace integrations built-in', 'Fast response times & priority processing', 'Next-generation voice interactive mode', 'Multimodal reading (photos, videos, docs)'],
    deliveryMethod: 'Exclusive Sub-account / Shared workspace access with isolated private chat sessions.',
    rating: 4.7, ratingCount: 195,
  },
  {
    name: 'Midjourney Pro', slug: 'midjourney', badge: 'Top Pick', category: 'image',
    logo: 'Image',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Midjourney_Emblem.svg/200px-Midjourney_Emblem.svg.png',
    shortDescription: 'Create stunning AI images with ease.',
    description: 'The absolute gold standard of generative art. Access Midjourney Pro on Discord or Web portal to generate highly aesthetic, photorealistic, and illustrative assets.',
    monthlyPrice: 849, originalPrice: 2499, deliveryTime: 'Instant Delivery',
    features: ['Fast Image Generation Hours', 'Stealth Mode', 'Parallel Generation (up to 12 jobs)', 'Access both Discord and Web visual editor', 'Commercial utilization rights'],
    deliveryMethod: 'Discord Shared Workspace Premium Bot channel or authenticated Web portal mirror access.',
    rating: 4.9, ratingCount: 420,
  },
  {
    name: 'Cursor Pro', slug: 'cursor-pro', badge: 'Developer', category: 'code',
    logo: 'Code2',
    image: 'https://avatars.githubusercontent.com/u/100114372?s=200&v=4',
    shortDescription: 'The AI code editor built for developers.',
    description: 'Cursor is the premier fork of VS Code optimized for coding with AI. Write code, debug terminals, and chat with your entire codebase natively.',
    monthlyPrice: 1099, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    features: ['Unlimited Fast AI Chat queries', 'Premium Custom Model selection', 'Local codebase embedding indexing', 'Copilot++ intelligent inline completions', 'Terminal command auto-completions'],
    deliveryMethod: 'OAuth secure token proxy link compatible with the official Cursor application.',
    rating: 4.9, ratingCount: 289,
  },
  {
    name: 'Perplexity Pro', slug: 'perplexity-pro', badge: 'New', category: 'productivity',
    logo: 'SearchCode',
    image: 'https://avatars.githubusercontent.com/u/110817097?s=200&v=4',
    shortDescription: 'AI search engine for smarter answers.',
    description: 'The premier conversational answer engine. Perplexity Pro searches the web in real-time, cites authoritative sources, and processes massive files.',
    monthlyPrice: 849, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    features: ['Unlimited Pro Searches each day', 'Advanced File Upload and analysis', 'Choose your active LLM (Sonnet, GPT, etc)', 'Full Collection sharing & publishing', 'Includes $5 monthly AI API credits'],
    deliveryMethod: 'Direct Premium Account details / Chrome extension token switcher.',
    rating: 4.8, ratingCount: 215,
  },
  {
    name: 'Notion AI Pro', slug: 'notion-ai', category: 'productivity',
    logo: 'Layers',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/200px-Notion-logo.svg.png',
    shortDescription: 'AI assistant inside Notion workspace.',
    description: 'Bring the computational power of modern generative AI straight into your Notion workspace pages. Auto-summarize team wikis, draft documents instantly, fix grammar.',
    monthlyPrice: 749, originalPrice: 1249, deliveryTime: 'Instant Delivery',
    features: ['Unlimited AI Prompts inside Notion editor', 'Smart database autofill & summaries', 'Instant editing and tone adjustments', 'Action item extraction from meeting summaries', 'Collaborative shared team workspaces'],
    deliveryMethod: 'Shared Workspace team invite with complete Premium Notion AI features.',
    rating: 4.6, ratingCount: 144,
  },
  {
    name: 'Copilot Pro', slug: 'copilot-pro', category: 'productivity',
    logo: 'ToggleLeft',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Copilot_20231028_icon.svg/200px-Copilot_20231028_icon.svg.png',
    shortDescription: 'Your everyday AI companion by Microsoft.',
    description: 'Unlock supercharged productivity in Microsoft 365 apps. Integrate Word, Excel, PowerPoint, Outlook, and OneNote with deep generative power.',
    monthlyPrice: 849, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    features: ['Seamless Microsoft 365 App Integrations', 'Priority GPT-4o access during peak times', 'Designer Studio boost credits', 'Excel auto-formula drafting', 'Advanced slide deck creation'],
    deliveryMethod: 'Authenticated account login credentials or managed Microsoft 365 Family sub-invites.',
    rating: 4.5, ratingCount: 130,
  },
  {
    name: 'Runway Gen-3 Pro', slug: 'runway-gen3', category: 'video',
    logo: 'Film',
    image: 'https://avatars.githubusercontent.com/u/92147767?s=200&v=4',
    shortDescription: 'Create next-gen AI videos and visuals.',
    description: 'Transform words, images, or audio clips into striking cinematic sequences. Runway Gen-3 features extreme temporal consistency and breathtaking fluid physics simulation.',
    monthlyPrice: 1349, originalPrice: 2999, deliveryTime: 'Instant Delivery',
    features: ['Generous monthly generation credits', 'HD cinematic exports (no watermarks)', 'Text-to-Video and Video-to-Video models', 'Custom camera motion controllers', 'Motion brushing & temporal keyframing'],
    deliveryMethod: 'Secure dedicated workspace portal credentials delivered step-by-step.',
    rating: 4.8, ratingCount: 180,
  },
  {
    name: 'ElevenLabs Pro', slug: 'elevenlabs-pro', category: 'voice',
    logo: 'Speaker',
    image: 'https://avatars.githubusercontent.com/u/107006862?s=200&v=4',
    shortDescription: 'Realistic AI voice generation platform.',
    description: 'The gold standard of text-to-speech generators. Clone your own voice, design unique speaking profiles, and synthesize emotional human speech in dozens of global languages.',
    monthlyPrice: 699, originalPrice: 1849, deliveryTime: 'Instant Delivery',
    features: ['100,000 monthly characters allocation', 'Professional custom voice cloning', 'Access to advanced Voice Design controls', 'High fidelity MP3 sound output', 'Full commercial rights and distribution'],
    deliveryMethod: 'API proxy route key or authenticated Premium sub-account credentials.',
    rating: 4.7, ratingCount: 225,
  },
  {
    name: 'DALL-E 3 Plus', slug: 'dall-e-3', category: 'design',
    logo: 'Palette',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/200px-ChatGPT_logo.svg.png',
    shortDescription: 'Generate stunning images from text.',
    description: "OpenAI's flagship DALL-E 3 visual engine. Excels at rendering complex, high-clarity graphic elements, readable text inside illustrations, and rich color palettes.",
    monthlyPrice: 749, originalPrice: 1249, deliveryTime: 'Instant Delivery',
    features: ['Incredibly high accuracy prompt following', 'Readable typography inside image renders', 'Widescreen and vertical canvas ratios', 'Automatic prompt helpers', 'Full royalty-free commercial rights'],
    deliveryMethod: 'Instant DALL-E 3 dedicated editor / OpenAI API consumer panel login access.',
    rating: 4.7, ratingCount: 167,
  },
  {
    name: 'Suno AI Pro', slug: 'suno-pro', category: 'voice',
    logo: 'Music',
    image: 'https://avatars.githubusercontent.com/u/131885552?s=200&v=4',
    shortDescription: 'Create songs with AI music generator.',
    description: 'Express your musical visions in any style or lyric. Suno AI Pro creates high-fidelity complete arrangements including vocals, backing tracks, drums, and solos.',
    monthlyPrice: 699, originalPrice: 849, deliveryTime: 'Instant Delivery',
    features: ['2,500 monthly song generation credits', 'Full commercial monetization rights', 'High-quality audio track downloads', 'Custom lyrics, style, and instrumentation', 'Priority servers with faster queues'],
    deliveryMethod: 'Suno workspace premium account or browser authentication token.',
    rating: 4.8, ratingCount: 198,
  },
];

const bundles = [
  {
    name: 'Creator Bundle',
    price: 2399, originalPrice: 3399, savingPercent: 30,
    products: ['Midjourney Pro', 'Runway Gen-3 Pro', 'ChatGPT Plus'],
    toolsCount: 3, colorTheme: 'creator' as const,
    features: [
      'Perfect for designers, YouTubers, and videomakers',
      'High-fidelity cinematics & visual image processing',
      'All chat, video, and image requirements in one',
    ],
  },
  {
    name: 'Pro Bundle',
    price: 2299, originalPrice: 3499, savingPercent: 35,
    products: ['Claude 3.5 Sonoma', 'ChatGPT Plus', 'Gemini Advanced'],
    toolsCount: 3, colorTheme: 'pro' as const,
    features: [
      'The Holy Trinity of Conversational AI Assistants',
      'Compare outputs across LLMs instantly',
      'Maximize research capacity with over 1.2M token workspace',
    ],
  },
  {
    name: 'Ultimate Bundle',
    price: 2699, originalPrice: 4499, savingPercent: 40,
    products: ['ChatGPT Plus', 'Notion AI Pro', 'Suno AI Pro', 'Cursor Pro', 'ElevenLabs Pro'],
    toolsCount: 5, colorTheme: 'ultimate' as const,
    features: [
      'The complete developer and business operating suite',
      'Includes text, code, voice, databases, and audio tools',
      'Over ₹1800+ separate monthly SaaS cost saved instantly',
    ],
  },
];

const promoCodes = [
  { code: 'AINEST10', discountType: 'percentage' as const, discountValue: 10 },
  { code: 'PROMO10',  discountType: 'percentage' as const, discountValue: 10 },
  { code: 'LAUNCH20', discountType: 'percentage' as const, discountValue: 20 },
  { code: 'SUMMER20', discountType: 'percentage' as const, discountValue: 20 },
];

const defaultSettings = [
  { key: 'upi_id',          value: 'ainest@merchant-upi',             label: 'UPI ID' },
  { key: 'upi_name',        value: 'AI Nest',                          label: 'UPI Display Name' },
  { key: 'crypto_address',  value: '0x4b78A9C102Ef34cD7189033fA675306B78e1212c', label: 'Crypto Wallet Address' },
  { key: 'crypto_network',  value: 'Ethereum (ERC-20)',                label: 'Crypto Network' },
  { key: 'support_email',     value: 'support@ainest.com',              label: 'Support Email' },
  { key: 'site_name',         value: 'AI Nest',                          label: 'Site Name' },
  { key: 'whatsapp_number',   value: '919876543210',                     label: 'WhatsApp Number' },
];

async function seed() {
  await connectDB();

  // Products
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✓ Seeded ${products.length} products`);

  // Bundles
  await Bundle.deleteMany({});
  await Bundle.insertMany(bundles);
  console.log(`✓ Seeded ${bundles.length} bundles`);

  // Promo codes
  await PromoCode.deleteMany({});
  await PromoCode.insertMany(promoCodes);
  console.log(`✓ Seeded ${promoCodes.length} promo codes`);

  // Settings
  await Settings.deleteMany({});
  await Settings.insertMany(defaultSettings);
  console.log(`✓ Seeded ${defaultSettings.length} settings`);

  // Admin user — create or reset password (pre-save hook handles hashing)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ainest.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({ name: 'Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`✓ Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    // Reset password so the pre-save hook re-hashes it correctly
    existing.password = adminPassword;
    await existing.save();
    console.log(`✓ Admin password reset: ${adminEmail} / ${adminPassword}`);
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
