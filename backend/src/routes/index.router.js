import { router as posts } from "./posts.router.js";
import { router as author } from "./authors.router.js";
import { router as comment } from "./comments.router.js"

export default function (app) {
    app.use('/', author);
    app.use('/', posts);
    app.use('/', comment)
}