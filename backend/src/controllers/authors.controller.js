import { authorService } from '../services/index.service.js';
import { authenticatePassword, newAccessToken } from '../auth/index.js';
import cuid from 'cuid';
import argon2 from 'argon2';

/**
 * Get all the authors of a given host
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns JSON with all authors on a host
 */
export async function getAllAuthors(req, res) {
	const authors = await authorService.getAuthors({
		page: parseInt(req.query.page),
		size: parseInt(req.query.size),
	});
	const host = `${req.protocol}://${req.get('host')}`;

	authors.forEach((author) => {
		author.type = 'author';
		author.url = `${host}/authors/${author.id}`;
		author.id = `${host}/authors/${author.id}`;
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
	const host = `${req.protocol}://${req.get('host')}`;

	author.url = `${host}/authors/${author.id}`;
	author.id = `${host}/authors/${author.id}`;
	author.host = `${host}/`;
	delete author.email;
	delete author.password;
	const response = {
		type: 'author',
		...author,
	};
	return res.status(200).json(response);
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

/**
 * Create a new author/user
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns Author information
 */
export async function newAuthor(req, res) {
	const user = req.body;
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

	// Create new JWT token and set it as a cookie
	const token = await newAccessToken(user.email, user.id);
	res.cookie('TOKEN', token, { maxAge: 604800, sameSite: 'strict' }); // 7 days
	return res.status(200).json({ token: token, ...userExists });
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
