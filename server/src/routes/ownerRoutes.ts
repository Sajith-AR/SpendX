import { Router } from 'express';
import { getAccountOwners, createAccountOwner, updateInitialBalances, deleteAccountOwner } from '../controllers/ownerController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getAccountOwners);
router.post('/', createAccountOwner);
router.put('/balances', updateInitialBalances);
router.delete('/:id', deleteAccountOwner);

export default router;
