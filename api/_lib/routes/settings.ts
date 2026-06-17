import { Router, Request, Response, NextFunction } from 'express';
import { Settings } from '../models/Settings';

const router = Router();

const PUBLIC_KEYS = ['whatsapp_number', 'site_name', 'support_email', 'upi_id', 'upi_name', 'brand_name', 'brand_tagline', 'brand_logo'];

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await Settings.find({ key: { $in: PUBLIC_KEYS } }).lean();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    res.json({ settings: map });
  } catch (err) {
    next(err);
  }
});

export default router;
