import { Router } from 'express';
import * as authController from '../controllers/authController';

const router: Router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;