import { Router } from 'express';
import { register, login, getMe, updateProfile, seedDemo } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT, getMe);
router.put('/profile', authenticateJWT, updateProfile);
router.post('/seed-demo', authenticateJWT, seedDemo);

export default router;
