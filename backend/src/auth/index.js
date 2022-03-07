import argon2 from 'argon2';
import { authService } from '../services/index.service.js';
import jwt from 'jsonwebtoken';

/**
 * Compare the hashed password to the user's inputted password
 * @param {String} email
 * @param {String} password
 * @returns Boolean
 */
export async function authenticatePassword(email, password) {
	const hashed = (await authService.getHashedPassword(email)).password;
	return await argon2.verify(hashed, password);
}

/**
 * Create a new access token
 * @param {String} email
 * @returns JWT
 */
export async function newAccessToken(email, id) {
	return jwt.sign({ email: email, id: id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
}

/**
 * Autehnticate a user using access token cookie
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @returns
 */
export async function authenticateToken(req, res, next) {
	const token = req.cookies.TOKEN;
	if (token === undefined || token === null || token === '') {
		return res.sendStatus(401);
	}
	try {
		req.user = jwt.verify(token, process.env.TOKEN);
		next();
	} catch (err) {
		return res.sendStatus(403);
	}
}
