import {Request, Response, Router} from 'express';
import * as authService from '../services/auth.service';
import {verifyToken} from "../services/auth.service";

const router: Router = Router();

router.post('/login', authService.login);
router.post('/logout', authService.logout);
router.post('/checkToken', authService.verifyToken);

export default router;