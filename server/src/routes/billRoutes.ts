import { Router } from 'express';
import { getBills, createBill, updateBillStatus, deleteBill } from '../controllers/billController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getBills);
router.post('/', createBill);
router.put('/:id/status', updateBillStatus);
router.delete('/:id', deleteBill);

export default router;
