import { Router } from 'express';
import { getDashboard } from '../controllers/user.controller';

const router = Router();

router.get('/dashboard', getDashboard);

export default router;
