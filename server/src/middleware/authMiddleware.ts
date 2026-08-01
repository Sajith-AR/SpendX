import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const GUEST_USER_ID = '65f1a2b3c4d5e6f708192a3b';
export const GUEST_USER_EMAIL = 'sajith@spendx.com';

const JWT_SECRET = process.env.JWT_SECRET || 'spendx_super_secret_jwt_key_2026';
export const GUEST_TOKEN = jwt.sign({ id: GUEST_USER_ID, email: GUEST_USER_EMAIL }, JWT_SECRET, { expiresIn: '365d' });

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    if (token === 'demo_token' || token === GUEST_TOKEN) {
      req.user = { id: GUEST_USER_ID, email: GUEST_USER_EMAIL };
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        // Fallback to guest user session for seamless access
        req.user = { id: GUEST_USER_ID, email: GUEST_USER_EMAIL };
        return next();
      }
      req.user = decoded;
      next();
    });
  } else {
    // If no authorization header provided, fallback to guest user
    req.user = { id: GUEST_USER_ID, email: GUEST_USER_EMAIL };
    next();
  }
};
