import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';
import { requireEnv } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function protect(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(createError('No token provided', 401));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, requireEnv('JWT_SECRET')) as JwtPayload;
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  } catch {
    next(createError('Invalid or expired token', 401));
  }
}

export function adminOnly(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (req.userRole !== 'admin') {
    return next(createError('Admin access required', 403));
  }
  next();
}
