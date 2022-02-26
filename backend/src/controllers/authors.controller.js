import { authorService } from "../services/index.service.js";

export async function getAllAuthors(req, res) {
    const authors = await authorService.getAuthors({ page: parseInt(req.query.page), size: parseInt(req.query.size) });
    const host = `${req.protocol}://${req.get('host')}`;

    authors.forEach(author => {
        author.type = "author";
        author.url = `${host}/authors/${author.id}`;
        author.id = `${host}/authors/${author.id}`;
        author.host = `${host}/`;
    });

    const response = {
        "type": "authors",
        "items": authors
    };
    return res.status(200).json(response);
}

export async function getOneAuthor(req, res) {
    const author = await authorService.getAuthors({ id: req.params.id });
    const host = `${req.protocol}://${req.get('host')}`;

    author.url = `${host}/authors/${author.id}`;
    author.id = `${host}/authors/${author.id}`;
    author.host = `${host}/`;

    const response = {
        "type": "author",
        ...author
    };
    return res.status(200).json(response);
}