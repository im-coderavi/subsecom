import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { connectDB } from './config/db';
import { Bundle } from './models/Bundle';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import promoRoutes from './routes/promo';
import adminRoutes from './routes/admin';
import settingsRoutes from './routes/settings';
import bundleRoutes from './routes/bundles';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

// Health check — does NOT touch the database (isolates module vs DB problems)
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'MISSING',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'MISSING',
      SMTP_USER: process.env.SMTP_USER ? 'set' : 'MISSING',
    },
  });
});

// Connect to DB on each request (cached after first connect)
let seeded = false;
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    if (!seeded) {
      seeded = true;
      const count = await Bundle.countDocuments();
      if (count === 0) {
        await Bundle.insertMany([
          {
            name: 'Creator Bundle', price: 2399, originalPrice: 3399, savingPercent: 30,
            products: ['Midjourney Pro', 'Runway Gen-3 Pro', 'ChatGPT Plus'],
            toolsCount: 3, colorTheme: 'creator',
            features: ['Perfect for designers, YouTubers, and videomakers', 'High-fidelity cinematics & visual image processing', 'All chat, video, and image requirements in one'],
          },
          {
            name: 'Pro Bundle', price: 2299, originalPrice: 3499, savingPercent: 35,
            products: ['Claude 3.5 Sonoma', 'ChatGPT Plus', 'Gemini Advanced'],
            toolsCount: 3, colorTheme: 'pro',
            features: ['The Holy Trinity of Conversational AI Assistants', 'Compare outputs across LLMs instantly', 'Maximize research capacity with over 1.2M token workspace'],
          },
          {
            name: 'Ultimate Bundle', price: 2699, originalPrice: 4499, savingPercent: 40,
            products: ['ChatGPT Plus', 'Notion AI Pro', 'Suno AI Pro', 'Cursor Pro', 'ElevenLabs Pro'],
            toolsCount: 5, colorTheme: 'ultimate',
            features: ['The complete developer and business operating suite', 'Includes text, code, voice, databases, and audio tools', 'Over ₹1800+ separate monthly SaaS cost saved instantly'],
          },
        ]);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/bundles', bundleRoutes);

// Gemini chat
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } })
  : null;

app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!ai) return res.status(500).json({ error: 'GEMINI_API_KEY not configured.' });
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: { systemInstruction: systemInstruction || 'You are a helpful assistant.' },
    });
    res.json({ text: response.text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gemini error';
    res.status(500).json({ error: message });
  }
});

// Error handler — surfaces the real error message (temporary debug)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API ERROR:', err);
  const status = err?.statusCode ?? 500;
  res.status(status).json({
    error: err?.message || 'Internal Server Error',
    name: err?.name,
    stack: process.env.NODE_ENV === 'production' ? String(err?.stack || '').split('\n').slice(0, 4) : undefined,
  });
});

export default app;
