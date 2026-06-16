import 'dotenv/config';

import mongoose from 'mongoose';
import { connectDB } from '../api/_lib/config/db';
import { Product } from '../api/_lib/models/Product';

// Images left empty — upload your own (owned/licensed) thumbnails via the admin panel.
// Until then, each card shows a clean branded placeholder (icon + name + glow).
const logo = (_domain: string) => '';

const products = [
  {
    name: 'ChatGPT Plus', slug: 'chatgpt-plus', category: 'chat', badge: 'Best Seller',
    logo: 'MessageSquareCode', image: logo('openai.com'),
    shortDescription: "OpenAI's most capable assistant with GPT-4o.",
    description: 'ChatGPT Plus unlocks GPT-4o, advanced reasoning, image generation, voice mode, file analysis and priority access — ideal for everyday work, coding and research.',
    monthlyPrice: 1199, originalPrice: 1999, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Account credentials delivered to your dashboard · Login & change password on first use.',
    features: ['Access to GPT-4o & o-series models', 'Image generation (DALL·E)', 'Advanced voice mode', 'File & data analysis', 'Priority during peak hours'],
    rating: 4.9, ratingCount: 512, plans: [], isActive: true,
  },
  {
    name: 'Claude Pro', slug: 'claude-pro', category: 'chat', badge: 'Popular',
    logo: 'Sparkles', image: logo('anthropic.com'),
    shortDescription: "Anthropic's Claude — brilliant at writing & code.",
    description: 'Claude Pro gives you 5x more usage, access to the latest Claude models, Projects, and large context windows — perfect for long documents, analysis and coding.',
    monthlyPrice: 1299, originalPrice: 1999, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Shared premium access + credentials via dashboard in 2–5 minutes.',
    features: ['Latest Claude models', '5x higher usage limits', 'Large 200K context window', 'Projects & artifacts', 'Priority access'],
    rating: 4.9, ratingCount: 348, plans: [], isActive: true,
  },
  {
    name: 'Gemini Advanced', slug: 'gemini-advanced', category: 'chat', badge: 'Trending',
    logo: 'Sparkle', image: logo('gemini.google.com'),
    shortDescription: "Google's most powerful AI with 1M+ context.",
    description: 'Gemini Advanced unlocks Google’s top model with a massive context window, Deep Research, and deep Workspace integration across Docs, Gmail and more.',
    monthlyPrice: 999, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Dedicated sub-account / shared workspace access with private sessions.',
    features: ['1M+ token context', 'Google Workspace integration', 'Deep Research mode', 'Fast priority responses', 'Multimodal (image, docs, video)'],
    rating: 4.7, ratingCount: 195, plans: [], isActive: true,
  },
  {
    name: 'Perplexity Pro', slug: 'perplexity-pro', category: 'chat', badge: 'New',
    logo: 'SearchCode', image: logo('perplexity.ai'),
    shortDescription: 'AI answer engine with real-time web sources.',
    description: 'Perplexity Pro searches the web in real time with cited sources, lets you pick your model (GPT, Claude, Gemini), and handles file uploads — research, fast.',
    monthlyPrice: 849, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Premium account details / extension token switcher.',
    features: ['Unlimited Pro searches', 'Choose your LLM', 'File upload & analysis', 'Cited, source-backed answers', 'Monthly API credits'],
    rating: 4.8, ratingCount: 215, plans: [], isActive: true,
  },
  {
    name: 'Cursor Pro', slug: 'cursor-pro', category: 'code', badge: 'Developer',
    logo: 'Code2', image: logo('cursor.com'),
    shortDescription: 'The AI code editor built for developers.',
    description: 'Cursor Pro brings frontier AI into your editor — fast chat, codebase-aware completions, multi-file edits and agent mode to ship faster.',
    monthlyPrice: 1099, originalPrice: 1699, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Secure OAuth token / account credentials compatible with the official app.',
    features: ['Unlimited fast AI requests', 'Premium model selection', 'Codebase-aware completions', 'Multi-file agent edits', 'Terminal & inline AI'],
    rating: 4.9, ratingCount: 289, plans: [], isActive: true,
  },
  {
    name: 'GitHub Copilot Pro', slug: 'github-copilot-pro', category: 'code',
    logo: 'GitBranch', image: logo('github.com'),
    shortDescription: 'AI pair-programmer inside your IDE.',
    description: 'GitHub Copilot Pro delivers smart code completions, Copilot Chat, and model choice across VS Code, JetBrains and more — your everyday coding co-pilot.',
    monthlyPrice: 899, originalPrice: 1499, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Account credentials / managed seat invite.',
    features: ['Inline code completions', 'Copilot Chat', 'Multiple model choice', 'Works across all major IDEs', 'CLI & PR assistance'],
    rating: 4.7, ratingCount: 176, plans: [], isActive: true,
  },
  {
    name: 'Midjourney Pro', slug: 'midjourney-pro', category: 'image', badge: 'Top Pick',
    logo: 'Image', image: logo('midjourney.com'),
    shortDescription: 'The gold standard of AI image generation.',
    description: 'Midjourney Pro creates stunning, photorealistic and artistic visuals with fast generation hours, stealth mode and full commercial rights.',
    monthlyPrice: 1349, originalPrice: 2499, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Discord premium workspace channel / authenticated web portal.',
    features: ['Fast generation hours', 'Stealth (private) mode', 'Up to 12 parallel jobs', 'Web + Discord access', 'Commercial usage rights'],
    rating: 4.9, ratingCount: 420, plans: [], isActive: true,
  },
  {
    name: 'Leonardo AI', slug: 'leonardo-ai', category: 'image',
    logo: 'Palette', image: logo('leonardo.ai'),
    shortDescription: 'Production-grade AI art & asset generation.',
    description: 'Leonardo AI gives you high token allowances, fine-tuned models, real-time canvas and upscaling — built for game art, design and content creation.',
    monthlyPrice: 799, originalPrice: 1499, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Premium account credentials delivered via dashboard.',
    features: ['Large daily token pool', 'Fine-tuned & custom models', 'Real-time canvas', 'AI upscaling', 'Commercial license'],
    rating: 4.6, ratingCount: 132, plans: [], isActive: true,
  },
  {
    name: 'Runway Gen-3', slug: 'runway-gen3', category: 'video', badge: 'Pro',
    logo: 'Film', image: logo('runwayml.com'),
    shortDescription: 'Cinematic AI video generation.',
    description: 'Runway Gen-3 turns text, images and clips into striking cinematic video with strong temporal consistency, camera controls and HD watermark-free exports.',
    monthlyPrice: 1499, originalPrice: 2999, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Dedicated workspace portal credentials, step-by-step.',
    features: ['Generous monthly credits', 'Text/Image-to-Video', 'HD exports, no watermark', 'Camera motion controls', 'Motion brush & keyframes'],
    rating: 4.8, ratingCount: 180, plans: [], isActive: true,
  },
  {
    name: 'CapCut Pro', slug: 'capcut-pro', category: 'video', badge: 'Popular',
    logo: 'Clapperboard', image: logo('capcut.com'),
    shortDescription: 'Pro video editing with AI tools.',
    description: 'CapCut Pro unlocks premium effects, AI tools, cloud space and watermark-free 4K exports — edit like a studio on desktop and mobile.',
    monthlyPrice: 549, originalPrice: 1199, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Premium account credentials (personal account).',
    features: ['Watermark-free 4K export', 'All premium effects & fonts', 'AI tools (captions, BG removal)', 'Cloud storage', 'Desktop + mobile'],
    rating: 4.7, ratingCount: 240, plans: [], isActive: true,
  },
  {
    name: 'ElevenLabs Pro', slug: 'elevenlabs-pro', category: 'voice', badge: 'New',
    logo: 'AudioLines', image: logo('elevenlabs.io'),
    shortDescription: 'Ultra-realistic AI voice & cloning.',
    description: 'ElevenLabs Pro gives you a large monthly character pool, professional voice cloning, multilingual TTS and high-fidelity audio with commercial rights.',
    monthlyPrice: 699, originalPrice: 1849, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'API proxy key / premium sub-account credentials.',
    features: ['Large monthly character pool', 'Professional voice cloning', 'Multilingual TTS', 'High-fidelity audio', 'Commercial rights'],
    rating: 4.7, ratingCount: 225, plans: [], isActive: true,
  },
  {
    name: 'Suno Pro', slug: 'suno-pro', category: 'voice',
    logo: 'Music', image: logo('suno.com'),
    shortDescription: 'Create full songs with AI.',
    description: 'Suno Pro generates complete, high-fidelity songs — vocals, instruments and lyrics — with monthly credits, faster queues and commercial monetization.',
    monthlyPrice: 699, originalPrice: 1199, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Workspace premium account / browser auth token.',
    features: ['Monthly song credits', 'Commercial monetization', 'High-quality downloads', 'Custom lyrics & styles', 'Priority queue'],
    rating: 4.8, ratingCount: 198, plans: [], isActive: true,
  },
  {
    name: 'Notion AI', slug: 'notion-ai', category: 'productivity', badge: 'Popular',
    logo: 'Layers', image: logo('notion.so'),
    shortDescription: 'AI assistant inside your workspace.',
    description: 'Notion AI writes, summarizes, and answers questions across your entire workspace — autofill databases, draft docs and extract action items instantly.',
    monthlyPrice: 749, originalPrice: 1249, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Shared workspace team invite with full Notion AI features.',
    features: ['Unlimited AI in editor', 'Database autofill & summaries', 'Q&A across workspace', 'Meeting note extraction', 'Team collaboration'],
    rating: 4.6, ratingCount: 144, plans: [], isActive: true,
  },
  {
    name: 'Gamma Pro', slug: 'gamma-pro', category: 'productivity',
    logo: 'Presentation', image: logo('gamma.app'),
    shortDescription: 'AI-powered decks & presentations.',
    description: 'Gamma Pro creates beautiful presentations, docs and webpages from a prompt — unlimited AI generation, custom branding and no watermark exports.',
    monthlyPrice: 649, originalPrice: 1099, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Premium account credentials via dashboard.',
    features: ['Unlimited AI generations', 'Custom branding & themes', 'No watermark exports', 'Decks, docs & sites', 'Analytics'],
    rating: 4.6, ratingCount: 121, plans: [], isActive: true,
  },
  {
    name: 'Canva Pro', slug: 'canva-pro', category: 'design', badge: 'Best Seller',
    logo: 'PenTool', image: logo('canva.com'),
    shortDescription: 'Design anything — with premium + AI.',
    description: 'Canva Pro unlocks 100M+ premium assets, Magic Studio AI tools, brand kits, background remover and unlimited folders — design without limits.',
    monthlyPrice: 499, originalPrice: 1299, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Team invite / shared premium membership.',
    features: ['100M+ premium assets', 'Magic Studio AI tools', 'Background remover', 'Brand kit & resize', 'Unlimited storage'],
    rating: 4.8, ratingCount: 510, plans: [], isActive: true,
  },
  {
    name: 'Figma Professional', slug: 'figma-pro', category: 'design',
    logo: 'Frame', image: logo('figma.com'),
    shortDescription: 'Collaborative interface design tool.',
    description: 'Figma Professional unlocks unlimited projects, version history, shared libraries and dev mode — the industry standard for UI/UX design teams.',
    monthlyPrice: 899, originalPrice: 1599, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Seat invite to a shared professional team.',
    features: ['Unlimited projects & files', 'Shared component libraries', 'Version history', 'Dev mode', 'Advanced prototyping'],
    rating: 4.7, ratingCount: 167, plans: [], isActive: true,
  },
  {
    name: 'Adobe Creative Cloud', slug: 'adobe-creative-cloud', category: 'design', badge: 'Pro Suite',
    logo: 'Brush', image: logo('adobe.com'),
    shortDescription: 'All Adobe apps. One subscription.',
    description: 'Adobe Creative Cloud gives you the full suite — Photoshop, Illustrator, Premiere Pro, After Effects and more — plus cloud storage and Adobe Firefly AI.',
    monthlyPrice: 1799, originalPrice: 4999, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Genuine account credentials with full app access.',
    features: ['20+ creative apps', 'Photoshop & Illustrator', 'Premiere & After Effects', 'Adobe Firefly AI', '100GB cloud storage'],
    rating: 4.8, ratingCount: 305, plans: [], isActive: true,
  },
  {
    name: 'Jasper AI', slug: 'jasper-ai', category: 'writing',
    logo: 'FileText', image: logo('jasper.ai'),
    shortDescription: 'AI copywriter for marketing teams.',
    description: 'Jasper AI generates on-brand marketing copy, blogs, ads and emails at scale, with brand voice, templates and SEO mode for content teams.',
    monthlyPrice: 1099, originalPrice: 1999, deliveryTime: 'Instant Delivery',
    deliveryMethod: 'Premium account credentials via dashboard.',
    features: ['Brand voice & memory', '50+ copy templates', 'SEO mode', 'Long-form editor', 'Team workflows'],
    rating: 4.5, ratingCount: 98, plans: [], isActive: true,
  },
];

async function run() {
  await connectDB();
  const before = await Product.countDocuments();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✓ Removed ${before} old products, inserted ${products.length} new products`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
