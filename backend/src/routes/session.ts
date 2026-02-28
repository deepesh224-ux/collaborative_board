import { Router } from 'express';
import { createSession, getSession, updateSessionData } from '../controllers/session.controller';

const router = Router();

router.post('/', createSession);
router.get('/:id', getSession);
router.put('/:id', updateSessionData);

export default router;
