import { Router } from 'express';
import { exportTransactionsCSV } from '../controllers/exportController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/csv', exportTransactionsCSV);

export default router;
