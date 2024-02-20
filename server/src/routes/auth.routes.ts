import {Router} from 'express';
import * as authService from '../services/auth.service';


const router: Router = Router();

router.post('/login', authService.login);
router.post('/logout', authService.logout);


export default router;