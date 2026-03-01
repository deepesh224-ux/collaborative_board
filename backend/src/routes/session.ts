import { Router } from 'express';
import { createSession, getSession, updateSessionData, deleteSession, saveSession } from '../controllers/session.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createSession);
router.get('/:id', getSession);
router.put('/:id', updateSessionData);
router.put('/:id/save', saveSession);
router.delete('/:id', deleteSession);

export default router;
