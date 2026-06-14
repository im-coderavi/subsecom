import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { connectDB } from './_lib/config/db';
import { Bundle } from './_lib/models/Bundle';
import authRoutes from './_lib/routes/auth';
import productRoutes from './_lib/routes/products';
import orderRoutes from './_lib/routes/orders';
import promoRoutes from './_lib/routes/promo';
import adminRoutes from './_lib/routes/admin';
import settingsRoutes from './_lib/routes/settings';
import bundleRoutes from './_lib/routes/bundles';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

// Health check — does NOT touch the database
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
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

// Gemini chat — construct client lazily
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured.' });
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
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

// Error handler — surfaces the real error message
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API ERROR:', err);
  const status = err?.statusCode ?? 500;
  res.status(status).json({ error: err?.message || 'Internal Server Error', name: err?.name });
});

export default app;
