import { Router, Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/products  — list with optional filters
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;

    const filter: Record<string, unknown> = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search as string };
    }

    if (minPrice || maxPrice) {
      filter.monthlyPrice = {};
      if (minPrice) (filter.monthlyPrice as Record<string, unknown>).$gte = Number(minPrice);
      if (maxPrice) (filter.monthlyPrice as Record<string, unknown>).$lte = Number(maxPrice);
    }

    let sortOption: Record<string, 1 | -1> = { ratingCount: -1 };
    if (sort === 'price_asc') sortOption = { monthlyPrice: 1 };
    else if (sort === 'price_desc') sortOption = { monthlyPrice: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(filter).sort(sortOption).lean();
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!product) return next(createError('Product not found', 404));
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

export default router;
