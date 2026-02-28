import { Router } from 'express';
import { createSession, getSession, updateSessionData, deleteSession } from '../controllers/session.controller';

const router = Router();

router.post('/', createSession);
router.get('/:id', getSession);
router.put('/:id', updateSessionData);
router.delete('/:id', deleteSession);

export default router;
