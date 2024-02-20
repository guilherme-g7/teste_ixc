import {Router} from 'express';
import * as conversationService from '../services/conversation.service';

const router: Router = Router();

router.get('/messages', conversationService.getConversationsAndMessages);


export default router;