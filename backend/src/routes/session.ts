import { Router } from 'express';
import { createSession, getSession, updateSessionData, deleteSession, saveSession } from '../controllers/session.controller';

const router = Router();

router.post('/', createSession);
router.get('/:id', getSession);
router.put('/:id', updateSessionData);
router.put('/:id/save', saveSession);
router.delete('/:id', deleteSession);

export default router;
