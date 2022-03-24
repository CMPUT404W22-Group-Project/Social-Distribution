import { Router } from 'express';
import * as inboxController from "../controllers/inbox.controller.js";
import { authenticateToken } from '../auth/index.js';

const router = Router();

router.get('/authors/:id/inbox', authenticateToken, inboxController.getInbox);
// TODO: Basic auth
router.post('/authors/:id/inbox', authenticateToken, inboxController.postToInbox);
router.delete('/authors/:id/inbox', authenticateToken, inboxController.deleteInbox);

export { router };
