import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Order } from '../models/Order';
import { PromoCode } from '../models/PromoCode';
import { protect, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { generateCredentials } from '../utils/generateCredentials';

const router = Router();

// Proof upload setup
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const proofStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `proof-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const proofUpload = multer({
  storage: proofStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// POST /api/orders/upload-proof  — authenticated user uploads payment screenshot
router.post('/upload-proof', protect, (req: AuthRequest, res: Response, _next: NextFunction) => {
  proofUpload.single('proof')(req as any, res as any, (err: any) => {
    if (err) { res.status(400).json({ error: err.message || 'Upload failed' }); return; }
    const file = (req as any).file;
    if (!file) { res.status(400).json({ error: 'No file provided' }); return; }
    res.json({ url: `/uploads/${file.filename}` });
  });
});

// POST /api/orders
router.post('/', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items, subtotal, discount, total, promoCode, paymentMethod, userEmail, userName, utrNumber, paymentProof } = req.body;

    if (!items?.length) return next(createError('Order must contain at least one item', 400));
    if (!paymentMethod) return next(createError('Payment method is required', 400));
    if (!userEmail || !userName) return next(createError('User details are required', 400));

    if (paymentMethod === 'upi') {
      if (!utrNumber?.trim()) return next(createError('UTR / reference number is required for UPI payments', 400));
    }

    // Validate promo code
    if (promoCode) {
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase(), isActive: true });
      if (!promo) return next(createError('Invalid promo code', 400));
      if (promo.expiresAt && promo.expiresAt < new Date()) return next(createError('Promo code has expired', 400));
      if (promo.usageLimit && promo.usageCount >= promo.usageLimit) return next(createError('Promo code usage limit reached', 400));
      await PromoCode.findByIdAndUpdate(promo._id, { $inc: { usageCount: 1 } });
    }

    const isUpi = paymentMethod === 'upi';

    const order = await Order.create({
      user: req.userId,
      userEmail: userEmail.toLowerCase(),
      userName,
      items,
      subtotal,
      discount: discount ?? 0,
      total,
      promoCode: promoCode?.toUpperCase(),
      paymentMethod,
      status: isUpi ? 'pending' : 'completed',
      credentials: isUpi ? [] : generateCredentials(items),
      utrNumber: isUpi ? utrNumber?.trim() : undefined,
      paymentProof: isUpi ? paymentProof : undefined,
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders
router.get('/', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId }).lean();
    if (!order) return next(createError('Order not found', 404));
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

export default router;
