import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'spendx_super_secret_jwt_key_2026';

    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ success: false, message: 'Authorization token required.' });
  }
};
