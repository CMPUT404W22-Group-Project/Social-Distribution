import { authorService } from "../services/index.service.js";

/**
 * Get all the authors of a given host
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns JSON with all authors on a host
 */
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

/**
 * Get information of one author (Using author id)
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns JSON of one author
 */
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

export async function postAuthor(req, res){
    const author = req.body;
    author.id = req.params.id;
    if (!validAuthor(author)){
        return res.status(400).json({ error: 'Missing required property' });
    }
    const newAuthor = await authorService.newAuthor(author);
    return res.status(201).json(newAuthor);
}

function validPost(author) {
    if (!author.type ||
        !author.id ||
        !author.github ||
        !author.displayName ||
        !author.profileImage) {
        return false;
    }
    return true;
}