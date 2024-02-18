import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import {Router} from "express";

const router: Router = Router();

router.use('/api/users', userRoutes);
router.use('/api/auth', authRoutes);

export default router;