import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import {Router} from "express";
import conversationRoutes from "./conversation.routes";

const router: Router = Router();

router.use('/api/users', userRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/conversation', conversationRoutes);

export default router;