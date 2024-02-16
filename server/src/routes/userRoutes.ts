import { Router } from 'express';
import * as userController from '../controllers/userController';

const router: Router = Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);

export default router;