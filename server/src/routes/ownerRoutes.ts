import { Router } from 'express';
import { getAccountOwners, createAccountOwner, deleteAccountOwner } from '../controllers/ownerController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getAccountOwners);
router.post('/', createAccountOwner);
router.delete('/:id', deleteAccountOwner);

export default router;
