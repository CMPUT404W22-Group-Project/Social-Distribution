import { Router } from 'express';
import * as followersController from '../controllers/followers.controller.js';
import { authenticateToken } from '../auth/index.js';

const router = Router();

router.get('/authors/:authorId/followers', followersController.getFollowers);
router.delete(
	'/authors/:authorId/followers/:foreignAuthorId',
	followersController.deleteFollower
);
router.put(
	'/authors/:authorId/followers/:foreignAuthorId',
	authenticateToken,
	followersController.addFollower
);
router.get(
	'/authors/:authorId/followers/:foreignAuthorId',
	followersController.checkIsFollower
);

export { router };
