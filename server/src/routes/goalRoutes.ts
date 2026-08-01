import { Router } from 'express';
import { getGoals, createGoal, updateGoal, addMoneyToGoal, deleteGoal } from '../controllers/goalController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.post('/:id/add-money', addMoneyToGoal);
router.delete('/:id', deleteGoal);

export default router;
