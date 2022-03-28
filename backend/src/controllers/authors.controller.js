import { authorService, nodesService } from '../services/index.service.js';
import { authenticatePassword, newAccessToken } from '../auth/index.js';
import cuid from 'cuid';
import argon2 from 'argon2';
import axios from 'axios';

async function httpGetAuthorById({ url, id }) {
	const node = await nodesService.getNodeByUrl(url);

	const response = await axios.get(`${node.url}/authors/${id}`, {
		auth: { username: node.username, password: node.password },
	});

	return response.data;
}

async function httpGetAuthors(node) {
	let authors = [];
	// const token = btoa(`${node.username}:${node.password}`);
	// const config = {
	// 	headers: {
	// 		Authorization: `Basic ${token}`,
	// 		'Access-Control-Allow-Origin': 'http://localhost:8000',
	// 		'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE',
	// 		'Access-Control-Allow-Headers':
	// 			'Access-Control-Allow-Headers, Origin,Accept, Content-Type, ',
	// 	},
	// };
	const response = await axios.get(`${node.url}/authors`, {
		auth: { username: node.username, password: node.password },
	});

	if (response.status === 200) {
		const remoteAuthors = response.data.items;

		await remoteAuthors.forEach((remoteAuthor) => {
			if (node.url === 'http://cmput404-project-t12.herokuapp.com/service') {
				remoteAuthor.url = `${node.url}/authors/${remoteAuthor.id}/`;
				remoteAuthor.id = remoteAuthor.url;
				remoteAuthor.type = 'author';
				remoteAuthor.profileImage = `http://cmput404-project-t12.herokuapp.com${remoteAuthor.profileImage}`;
			}
			remoteAuthor.node = node.url;
			authors = [...authors, remoteAuthor];
		});
		return authors;
	}
}

export async function getRemoteAuthorById(req, res) {
	if (!req.query.node) {
		return res.status(400).json({ error: 'request do not contain node' });
	}
	try {
		const author = await httpGetAuthorById({
			url: req.query.node,
			id: req.params.id,
		});
		author.node = req.query.node;
		if (author === 503) {
			return res.status(503);
		}
		return res.status(200).json({ ...author });
	} catch (error) {
		return res.status(503);
	}
}

export async function getRemoteAuthors(req, res) {
	let authors = [];
	const nodes = await nodesService.getNode();
	for (const node of nodes) {
		try {
			const result = await httpGetAuthors(node);
			authors = [...authors, ...result];
		} catch (error) {
			return res.status(503);
		}
	}
	const response = {
		type: 'authors',
		items: authors,
	};
	return res.status(200).json(response);
}

/**
 * Get all the authors of a given host
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns JSON with all authors on a host
 */
export async function getAllAuthors(req, res) {
	let authors = await authorService.getAuthors({
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const host = `${req.protocol}://${req.get('host')}`;

	authors.forEach((author) => {
		author.type = 'author';
		author.url = `${host}/authors/${author.id}/`;
		author.id = `${host}/authors/${author.id}/`;
		author.host = `${host}/`;
		delete author.email;
		delete author.password;
	});

	const response = {
		type: 'authors',
		items: authors,
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
	if (!author) {
		res.status(404).json({ error: 'No author not found' });
	} else {
		const host = `${req.protocol}://${req.get('host')}`;
		author.url = `${host}/authors/${author.id}/`;
		author.id = `${host}/authors/${author.id}/`;
		author.host = `${host}/`;
		delete author.email;
		delete author.password;
		const response = {
			type: 'author',
			...author,
		};
		return res.status(200).json(response);
	}
}

/**
 * Update author/user information
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Updated author information
 */
export async function updateAuthor(req, res) {
	const author = req.body;
	author.id = req.user.id;

	// Check if the user is modifying their own profile
	if (req.params.id !== req.user.id) {
		return res
			.status(401)
			.json({ error: "Cannot modify someone else's profile" });
	}

	// Check if the email is already taken
	if (author.email) {
		const check = await authorService.checkUserExists(author.email);
		if (check && req.params.id !== check.id) {
			return res.status(409).json({ error: 'Email in use' });
		}
	}

	// Hash the password if the password is being updated
	if (author.password) {
		author.password = await argon2.hash(author.password);
	}

	const updatedAuthor = await authorService.updateAuthor(author);
	return res.status(200).json(updatedAuthor);
}
//ADD ONE BOOLEAN FIELD TO REPRESENT STATE AUTHOR like activated?
export async function adminUpdateAuthor(req, res) {
	const author = req.body;
	author.id = req.params.id;

	const result = await authorService.getAuthors({ id: req.params.id });
	if (!result) {
		res.status(404).json({ error: 'No author not found' });
	}
	const updatedAuthor = await authorService.updateAuthor(author);
	delete updatedAuthor.email;
	delete updatedAuthor.password;
	return res.status(200).json(updatedAuthor);
}

export async function adminDeleteAuthor(req, res) {
	const result = await authorService.deleteAuthor({ id: req.params.id });
	if (!result) {
		res.status(404).json({ error: 'No author not found' });
	}

	return res.status(204).json(result);
}

/**
 * Create a new author/user
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Author information
 */
export async function newAuthor(req, res) {
	const user = req.body;
	const host = `${req.protocol}://${req.get('host')}`;
	user.id = cuid();

	// Check if all the required parameters exist
	if (!validAuthor(user)) {
		return res.status(400).json({ error: 'Missing required property' });
	}

	// Hash the password and store the new user in the database
	user.password = await argon2.hash(user.password);
	const newUser = await authorService.newAuthor(user);
	delete newUser.password;
	delete newUser.email;

	newUser.url = `${host}/authors/${newUser.id}/`;
	newUser.host = `${host}/`;
	// Create new JWT token and set it as a cookie
	const token = await newAccessToken(user.email, user.id);
	res.cookie('TOKEN', token, { maxAge: 604800, sameSite: 'strict' }); // 7 days
	return res.status(201).json({ type: 'author', ...newUser });
}

/**
 * Login a user by email and password
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Access token cookie
 */
export async function login(req, res) {
	const user = req.body;
	const host = `${req.protocol}://${req.get('host')}`;
	// Check if the user email exists
	const userExists = await authorService.checkUserExists(user.email);
	if (!userExists) {
		return res.status(409).json({ error: 'User does not exist' });
	} else {
		user.id = userExists.id;
	}

	// Check if the user password matches
	if (!(await authenticatePassword(user.email, user.password))) {
		return res.status(401).json({ error: 'Password mismatch' });
	}
	userExists.url = `${host}/authors/${userExists.id}/`;
	userExists.host = `${host}/`;
	// Create new JWT token and set it as a cookie
	const token = await newAccessToken(user.email, user.id);
	res.cookie('TOKEN', token, { maxAge: 604800, sameSite: 'strict' }); // 7 days
	return res.status(200).json({ ...userExists });
}

/**
 * Clear access token and logout
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns 401
 */
export async function logout(req, res) {
	if (req.cookies.TOKEN) {
		res.clearCookie('TOKEN', { sameSite: true });
	}
	return res.sendStatus(401);
}

/**
 * Check if valid author parameters exist
 * @param {Author object} author
 * @returns Boolean
 */
function validAuthor(author) {
	if (!author.id || !author.email || !author.password || !author.displayName) {
		return false;
	}
	return true;
}
