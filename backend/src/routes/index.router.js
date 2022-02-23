import { router as posts } from "./posts.router.js";
import { router as author } from "./authors.router.js";

export default function (app) {
    app.use('/', author);
    app.use('/', posts);
}