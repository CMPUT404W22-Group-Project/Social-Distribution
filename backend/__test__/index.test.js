import request from 'supertest';
import app from '../src/app.js';

describe('Test authors', () => {
	test('Should return 200 code when getting authors', () => {
		return request(app).get('/authors').expect(200);
	});
});
