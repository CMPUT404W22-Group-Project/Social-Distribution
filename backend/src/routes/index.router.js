import { router as author } from './authors.router.js';
import { router as posts } from './posts.router.js';
import { router as comment } from './comments.router.js';
import { router as likes } from './likes.router.js';
import { router as inbox } from './inbox.router.js';
import { router as followers } from './followers.router.js';
import { router as nodes } from './nodes.router.js';

export default function (app) {
	app.use('/', author);
	app.use('/', posts);
	app.use('/', comment);
	app.use('/', likes);
	app.use('/', inbox);
	app.use('/', followers);
	app.use('/', nodes);
}
