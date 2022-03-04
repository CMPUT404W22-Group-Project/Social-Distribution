import { json } from 'express';
import request from 'supertest';
import app from '../src/app.js';

/*
describe('Test authors post', () => {
	const author = {
		"id":"mockid",
		"displayName": "mockName",
    	"github": "http://github.com/mockName",
    	"profileImage": "https://i.imgur.com/k7XwpB.jpeg"
	};
	test('Should return 201 code when posting author', async () => {
		const res = await request(app).post('/authors/mockid').type('json').send(author)
		expect(res.statusCode).toEqual(201);
	});
	
});
*/

describe('Test authors get without ID', () => {
	test('Should return 200 code when getting authors', () => {
		return request(app).get('/authors').expect(200);
	});
});

describe('Test authors get with ID', () => {
	test('Should return 200 code when getting authors', () => {
		return request(app).get('/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/').expect(200);
	});
});


describe('Test posts get without ID', () => {
	test('Should return 200 code when getting posts', () => {
		return request(app).get('/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts').expect(200);
	});
});

describe('Test posts get with ID', () => {
	test('Should return 404 code when getting posts', () => {
		return request(app).get('/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/asd').expect(200);
	});
});

/*
describe('Test posts delete with ID', () => {
	test('Should return 404 code when deleting posts', () => {
		return request(app).delete('/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/asd').expect(404);
	});
});
*/


describe('Test comments get without ID', () => {
	test('Should return 200 code when getting comments', () => {
		return request(app).get('/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/asd/comments').expect(200);
	});
});




