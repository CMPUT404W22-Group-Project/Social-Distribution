import { Router } from 'express';
import { authenticateToken, isAdmin } from '../auth/index.js';
import * as nodesController from '../controllers/nodes.controller.js';

const router = Router();

// NOTE: Get nodes is not secure
router.get('/nodes', nodesController.getNode);
router.get(
	'/nodes/all',
	authenticateToken,
	isAdmin,
	nodesController.getAllNode
);
router.post('/nodes', authenticateToken, isAdmin, nodesController.addNode);
router.delete('/nodes', authenticateToken, isAdmin, nodesController.removeNode);
export { router };
