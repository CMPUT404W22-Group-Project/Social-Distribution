import { postService, authorService } from '../services/index.service.js';
import cuid from 'cuid';
import path from 'path';

/**
 * Get all posts that are public
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns All the posts of an author
 */
export async function getAllPublicPosts(req, res) {
  const posts = await postService.getPublicPosts();
  const host = `${req.protocol}://${req.get('host')}`;
  const author = await authorService.getAuthors({ id: req.params.authorId });

  posts.forEach((post) => {
    post.type = 'post';
    post.url = `${host}/authors/${post.authorId}/posts/${post.id}`;
    post.id = `${host}/authors/${post.authorId}/posts/${post.id}`;
    post.host = `${host}/`;
    post.author = { type: 'author', ...author[0] };
  });

  const response = {
    type: 'posts',
    items: posts,
  };

  return res.status(200).json(response);
}
/**
 * Get all posts of a given author
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns All the posts of an author
 */
export async function getAllPosts(req, res) {
	const posts = await postService.getPosts({
		authorId: req.params.authorId,
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const host = `${req.protocol}://${req.get('host')}`;
	const author = await authorService.getAuthors({ id: req.params.authorId });
	if (!author) {
		return res.status(404).json({ error: 'Author Not Found' });
	}

	posts.forEach((post) => {
		post.type = 'post';
		post.url = `${host}/authors/${post.authorId}/posts/${post.id}`;
		post.id = `${host}/authors/${post.authorId}/posts/${post.id}`;
		post.host = `${host}/`;
		post.author = { type: 'author', ...author };
	});

	const response = {
		type: 'posts',
		items: posts,
	};

	return res.status(200).json(response);
}

/**
 * Get one post of a given author (using author id)
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns The post information requested
 */
export async function getOnePost(req, res) {
	const post = await postService.getPosts({ id: req.params.id });
	const host = `${req.protocol}://${req.get('host')}`;
	if (!post) {
		return res.status(404).json({ error: 'Post Not Found' });
	}

	const author = await authorService.getAuthors({ id: post.authorId });
	if (!author) {
		return res.status(404).json({ error: 'Author Not Found' });
	}

	post.url = `${host}/authors/${post.authorId}/posts/${post.id}`;
	post.id = `${host}/authors/${post.authorId}/posts/${post.id}`;
	post.host = `${host}/`;

	const response = {
		type: 'post',
		...post,
		author,
	};

	return res.status(200).json(response);
}

/**
 * Create a new post with a specified post ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns New post
 */
export async function putPost(req, res) {
	const post = req.body;
	post.id = req.params.id;
	post.published = new Date();

	if (!validPost(post))
		return res.status(400).json({ error: 'Missing required property' });

	const newPost = await postService.putPost(post);
	return res.status(201).json(newPost);
}

/**
 * Delete a post given the post ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Deleted post
 */
export async function deletePost(req, res) {
	const id = req.params.id;
	if (!id) {
		return res.status(400).json({ error: 'Missing required property' });
	}
	await postService.deletePost(id);
	return res.status(204);
}

/**
 * Update a post given the post ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Updated post
 */
export async function updatePost(req, res) {
	const post = req.body;
	post.id = req.params.id;

	if (!validPost(post)) {
		return res.status(400).json({ error: 'Missing required property' });
	}

	const updatedPost = await postService.updatePost(post);
	return res.status(200).json(updatedPost);
}

/**
 * Create a new post with a generated ID
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns New post
 */
export async function newPost(req, res) {
	const post = req.body;
	post.id = cuid();
	post.published = new Date();

	if (!validPost(post))
		return res.status(400).json({ error: 'Missing required property' });

	const newPost = await postService.newPost(post);
	return res.status(201).json(newPost);
}

/**
 * Upload image to backend folder
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns New post
 */
export async function addPostImage(req, res) {
	const fileName = req.params.id;
	if (req.files === null)
		return res.status(400).json({ error: 'No file uploaded' });
	const file = req.files.file;
	file.mv(
		path.join(__dirname, '..', '..', 'public', 'uploads', fileName),
		(err) => {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			return res
				.status(200)
				.json({ filename: fileName, filePath: `/public/uploads/${fileName}` });
		}
	);
	return res.status(201).json(newPost);
}

/**
 * Check if post has all the required arguments
 * @param {Post object} post
 * @returns Boolean
 */
function validPost(post) {
	if (
		!post.id ||
		!post.authorId ||
		!post.title ||
		!post.source ||
		!post.origin ||
		!post.description ||
		!post.contentType ||
		!post.published ||
		!post.visibility ||
		post.unlisted === undefined
	) {
		return false;
	}
	return true;
}
