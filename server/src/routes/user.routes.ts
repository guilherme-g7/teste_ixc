import { Router } from 'express';
import * as userService from '../services/user.service'

const router: Router = Router();

router.get('/:email', userService.getUsers);
router.post('/', userService.register);


export default router;