import express from 'express';

const app = express();

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, msg: 'minimal handler alive', node: process.version });
});

app.get('/api/products', (_req, res) => {
  res.json({ products: [], note: 'minimal test — no DB yet' });
});

export default app;
