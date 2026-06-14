import { Router, Request, Response, NextFunction } from 'express';
import { PromoCode } from '../models/PromoCode';
import { createError } from '../middleware/errorHandler';

const router = Router();

// POST /api/promo/validate
router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    if (!code?.trim()) return next(createError('Promo code is required', 400));

    const promo = await PromoCode.findOne({ code: code.trim().toUpperCase(), isActive: true });
    if (!promo) return next(createError('Invalid promo code', 404));

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return next(createError('Promo code has expired', 400));
    }
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return next(createError('Promo code usage limit reached', 400));
    }

    res.json({
      valid: true,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
