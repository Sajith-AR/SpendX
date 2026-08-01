import { Router } from 'express';
import { getBudgets, createOrUpdateBudget, deleteBudget } from '../controllers/budgetController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getBudgets);
router.post('/', createOrUpdateBudget);
router.delete('/:id', deleteBudget);

export default router;
