import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect, adminOnly, AuthRequest } from '../middleware/auth';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Settings } from '../models/Settings';
import { Bundle } from '../models/Bundle';
import { createError } from '../middleware/errorHandler';
import { generateCredentials } from '../utils/generateCredentials';
import { sendPaymentConfirmation } from '../utils/mailer';

const router = Router();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer config — save to public/uploads/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// ── DASHBOARD STATS ──────────────────────────────────────────────
router.get('/stats', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalOrders, totalUsers, totalProducts, allOrders, recentUsers] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.find({ createdAt: { $gte: thirtyDaysAgo } }).select('total status createdAt items').lean(),
      User.find({ role: 'user', createdAt: { $gte: thirtyDaysAgo } }).select('createdAt').lean(),
    ]);

    const completedOrders = allOrders.filter((o) => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // Daily revenue for last 7 days
    const revenueByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      revenueByDay[key] = 0;
    }
    completedOrders
      .filter((o) => new Date(o.createdAt) >= sevenDaysAgo)
      .forEach((o) => {
        const key = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (key in revenueByDay) revenueByDay[key] += o.total;
      });
    const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }));

    // User registrations last 14 days
    const userByDay: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      userByDay[key] = 0;
    }
    recentUsers.forEach((u) => {
      const key = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in userByDay) userByDay[key]++;
    });
    const userGrowthChart = Object.entries(userByDay).map(([date, users]) => ({ date, users }));

    // Order status breakdown
    const statusCounts = {
      completed: allOrders.filter((o) => o.status === 'completed').length,
      pending:   allOrders.filter((o) => o.status === 'pending').length,
      failed:    allOrders.filter((o) => o.status === 'failed').length,
    };

    // Top products by order count
    const productCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    allOrders.forEach((o) => {
      if (o.status !== 'completed') return;
      (o.items as any[]).forEach((item) => {
        if (!productCounts[item.name]) productCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
        productCounts[item.name].count += item.quantity || 1;
        productCounts[item.name].revenue += item.price * (item.quantity || 1);
      });
    });
    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('userEmail userName total status paymentMethod createdAt items')
      .lean();

    // Recent activity (orders + users mixed, last 10)
    const recentActivity = await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(5).select('userName userEmail total status createdAt').lean(),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt').lean(),
    ]).then(([orders, users]) => {
      const items = [
        ...orders.map((o) => ({ type: 'order', label: `New order from ${o.userName}`, sub: `$${o.total.toFixed(2)} · ${o.status}`, time: o.createdAt })),
        ...users.map((u) => ({ type: 'user', label: `New user registered`, sub: u.email, time: u.createdAt })),
      ];
      return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);
    });

    res.json({
      totalOrders, totalUsers, totalProducts, totalRevenue,
      revenueChart, userGrowthChart, statusCounts, topProducts,
      recentOrders, recentActivity,
    });
  } catch (err) {
    next(err);
  }
});

// ── PRODUCTS ─────────────────────────────────────────────────────

// GET all products (including inactive)
router.get('/products', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

// POST create product
router.post('/products', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, slug, logo, image, badge, category, shortDescription, description,
      monthlyPrice, originalPrice, deliveryTime, features, deliveryMethod, rating, ratingCount } = req.body;

    if (!name || !slug || !category || !monthlyPrice || !originalPrice) {
      return next(createError('Required fields: name, slug, category, monthlyPrice, originalPrice', 400));
    }

    const existing = await Product.findOne({ slug: slug.toLowerCase() });
    if (existing) return next(createError('A product with this slug already exists', 409));

    const product = await Product.create({
      name, slug, logo: logo || 'Box', image, badge, category,
      shortDescription, description, monthlyPrice, originalPrice,
      deliveryTime: deliveryTime || 'Instant Delivery',
      features: features || [], deliveryMethod: deliveryMethod || '',
      rating: rating || 4.5, ratingCount: ratingCount || 0,
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});

// PUT update product
router.put('/products/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!product) return next(createError('Product not found', 404));
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

// DELETE product (permanent)
router.delete('/products/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(createError('Product not found', 404));
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

// ── ORDERS ───────────────────────────────────────────────────────

router.get('/orders', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '20'));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(),
    ]);

    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

router.put('/orders/:id/status', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!['pending', 'completed', 'failed'].includes(status)) {
      return next(createError('Invalid status', 400));
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return next(createError('Order not found', 404));
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// Approve a pending UPI order → generate credentials + send confirmation email
router.post('/orders/:id/approve', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(createError('Order not found', 404));
    if (order.status !== 'pending') return next(createError('Order is not pending', 400));

    const credentials = generateCredentials(order.items as any[]);
    order.status = 'completed';
    order.credentials = credentials as any;
    await order.save();

    try {
      await sendPaymentConfirmation({
        customerName: order.userName,
        customerEmail: order.userEmail,
        orderId: order._id.toString(),
        items: order.items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total: order.total,
        utrNumber: order.utrNumber,
        paidAt: new Date(),
      });
    } catch (mailErr) {
      console.error('Email send failed (order approved anyway):', mailErr);
    }

    res.json({ order, message: 'Order approved and confirmation email sent' });
  } catch (err) {
    next(err);
  }
});

// ── SETTINGS ─────────────────────────────────────────────────────

router.get('/settings', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await Settings.find().lean();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    res.json({ settings: map });
  } catch (err) {
    next(err);
  }
});

router.put('/settings', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const updates: Record<string, string> = req.body;
    const ops = Object.entries(updates).map(([key, value]) =>
      Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
    );
    await Promise.all(ops);
    res.json({ message: 'Settings updated' });
  } catch (err) {
    next(err);
  }
});

// ── IMAGE UPLOAD ─────────────────────────────────────────────────
router.post('/upload', (req: AuthRequest, res: Response, _next: NextFunction) => {
  upload.single('image')(req as any, res as any, (err: any) => {
    if (err) {
      res.status(400).json({ error: err.message || 'Upload failed' });
      return;
    }
    const file = (req as any).file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    res.json({ url: `/uploads/${file.filename}` });
  });
});

// ── USERS ────────────────────────────────────────────────────────
router.get('/users', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// ── BUNDLES ──────────────────────────────────────────────────────

router.get('/bundles', async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bundles = await Bundle.find().sort({ createdAt: 1 }).lean();
    res.json({ bundles });
  } catch (err) {
    next(err);
  }
});

router.post('/bundles', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, price, originalPrice, savingPercent, products, colorTheme, features } = req.body;
    if (!name || !price || !originalPrice || !products?.length) {
      return next(createError('name, price, originalPrice, and products are required', 400));
    }
    const bundle = await Bundle.create({
      name, price, originalPrice,
      savingPercent: savingPercent || 0,
      products,
      toolsCount: products.length,
      colorTheme: colorTheme || 'creator',
      features: features || [],
    });
    res.status(201).json({ bundle });
  } catch (err) {
    next(err);
  }
});

router.put('/bundles/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = { ...req.body };
    if (body.products) body.toolsCount = body.products.length;
    const bundle = await Bundle.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!bundle) return next(createError('Bundle not found', 404));
    res.json({ bundle });
  } catch (err) {
    next(err);
  }
});

router.delete('/bundles/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!bundle) return next(createError('Bundle not found', 404));
    res.json({ message: 'Bundle deactivated' });
  } catch (err) {
    next(err);
  }
});

router.patch('/bundles/:id/restore', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!bundle) return next(createError('Bundle not found', 404));
    res.json({ bundle });
  } catch (err) {
    next(err);
  }
});

export default router;
