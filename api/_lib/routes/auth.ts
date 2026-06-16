import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { requireEnv } from '../config/env';

const router = Router();

function signToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, requireEnv('JWT_SECRET'), { expiresIn: '30d' });
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return next(createError('Name, email and password are required', 400));
    }
    if (password.length < 6) {
      return next(createError('Password must be at least 6 characters', 400));
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return next(createError('Email is already registered', 409));

    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password });
    const token = signToken(String(user._id), user.email, user.role);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return next(createError('Email and password are required', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return next(createError('Invalid email or password', 401));
    }

    const token = signToken(String(user._id), user.email, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  (protected)
router.get('/me', protect, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return next(createError('User not found', 404));
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
});

export default router;
