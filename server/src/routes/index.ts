import userRoutes from './userRoutes';
import authRoutes from './authRoutes';
import {Router} from "express";

const router: Router = Router();

router.use('/api/users', userRoutes);
router.use('/api/auth', authRoutes);

export default router;