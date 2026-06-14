import { Router, Request, Response, NextFunction } from 'express';
import { Bundle } from '../models/Bundle';

const router = Router();

// GET all active bundles (public)
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const bundles = await Bundle.find({ isActive: true }).sort({ createdAt: 1 }).lean();
    res.json({ bundles });
  } catch (err) {
    next(err);
  }
});

export default router;
