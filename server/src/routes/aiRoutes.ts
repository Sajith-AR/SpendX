import { Router } from 'express';
import { askAIAssistant } from '../controllers/aiController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/query', askAIAssistant);

export default router;
