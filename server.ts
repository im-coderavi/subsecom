import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { connectDB } from './_server/config/db';
import { Bundle } from './_server/models/Bundle';
import authRoutes from './_server/routes/auth';
import productRoutes from './_server/routes/products';
import orderRoutes from './_server/routes/orders';
import promoRoutes from './_server/routes/promo';
import adminRoutes from './_server/routes/admin';
import settingsRoutes from './_server/routes/settings';
import bundleRoutes from './_server/routes/bundles';
import { errorHandler } from './_server/middleware/errorHandler';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB
  await connectDB();

  // Auto-seed default bundles if none exist
  const bundleCount = await Bundle.countDocuments();
  if (bundleCount === 0) {
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
    console.log('✓ Auto-seeded 3 default bundles');
  }

  // Body parsing
  app.use(express.json({ limit: '10mb' }));

  // Serve uploaded images from public/uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/promo', promoRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/bundles', bundleRoutes);

  // Gemini chat endpoint
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      })
    : null;

  app.post('/api/gemini/chat', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY environment variable is not configured.',
        });
      }

      const { messages, systemInstruction } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'messages array is required' });
      }

      const formattedContents = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' || msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.content || '' }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: { systemInstruction: systemInstruction || 'You are a helpful assistant.' },
      });

      res.json({ text: response.text });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred with Gemini.';
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: message });
    }
  });

  // Global error handler — must be after all routes
  app.use(errorHandler);

  // Vite dev middleware / static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
