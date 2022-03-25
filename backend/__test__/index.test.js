import express from 'express';
import request from 'supertest';
import app from '../src/app.js';
import argon2 from 'argon2';

import prisma from '../prisma/client.js';
import cuid from 'cuid';

jest.setTimeout(60000)


function randomString(len) {
	len = len || 32;
	let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
	let maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
const displayName = randomString(6);
const email = displayName + "@example.com";
let password = "123456";

let id = "";
let token = "";
let Cookie = "";

async function createAdminAccount() {
	let cryPassword = await argon2.hash(password)
	const testAdmin = await prisma.author.findFirst({
		where: {
			AND: [{
				email: "admintest123@example.com",
			}],
		},
	})
	if (!testAdmin) {
		await prisma.author.create({
			data: {
				id: cuid(), // Required
				email: "admintest123@example.com", // Required
				password: cryPassword, // Required
				displayName: 'admintest123',
				github: '',
				profileImage: '',
				admin: true
			},
		});
	}
}


//part nodes
// /nodes -- get
describe('Test get all nodes', () => {
	test('Test get all nodes by get method', async () => {
		const res = await request(app).get('/nodes')
		expect(res.statusCode).toEqual(200);
	});
});

describe('Test admin user login in', () => {
	const payload = {
		email: "admintest123@example.com",
		password
	}
	test('Should return 201 code when logining', async () => {
		await createAdminAccount()
		const res = await request(app).post('/login')
			.type("json")
			.send(payload)
		expect(res.statusCode).toEqual(200);
		id = res.body.id;
		token = res.header["set-cookie"][0].split(';')[0].split('=')[1]
		Cookie = res.header["set-cookie"][0];
		//console.log("id", id);
		//console.log("token", token);
	});
})

//  /nodes/all -- get
describe('Test get all nodes by auth', () => {
	test('Test get all nodes by get method', async () => {
		const res = await request(app).get('/nodes/all')
			.set("Cookie", Cookie)
		expect(res.statusCode).toEqual(200);
	});
});

//  /nodes -- post
describe('Test add Nodes by auth', () => {
	const payload = {
		type: 'receive',
		url: 'http://127.0.0.1',
		username: email,
		password,
	}
	test('Test add Nodes by auth post data to /nodes', async () => {
		const res = await request(app).post('/nodes')
			.set("Cookie", Cookie)
			.type("json")
			.send(payload);
		expect(res.statusCode).toEqual(201);
	});
});





//part author
describe('Test resister a new user', () => {
	const payload = {
		displayName,
		email,
		password
	}
	test('Should return 201 code when resistering', async () => {
		const res = await request(app).post('/register')
			.type("json")
			.send(payload)
		expect(res.statusCode).toEqual(201);
		id = res.body.id;
		token = res.header["set-cookie"][0].split(';')[0].split('=')[1]
		Cookie = res.header["set-cookie"][0];
		//console.log("id", id);
		//console.log("token", token);
	});
})



describe('Test Returns the list of all the authors', () => {
	test('Should return 200 code when request list of all the authers', async () => {
		const res = await request(app).get('/authors/')
		expect(res.statusCode).toEqual(200);
	});
})

describe('Test Returns a specific user by id', () => {
	test('Should return 200 code when query a specific user by id', async () => {
		const res = await request(app).get('/authors/' + id)
		expect(res.statusCode).toEqual(200);
	});
})

describe('Test update a existing user', () => {
	const payload = {
		'password': '123qwe'
	};
	test('Should return 200 code when update a specific user by id with password[123qwe]', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).post('/authors/' + id)
			.type("json")
			//.set("Cookie", "TOKEN="+token)  or
			//.set("Cookie", Cookie)
			.set('Authorization', authorization)
			.send(payload);
		//password = "123qwe"
		expect(res.statusCode).toEqual(200);
	});
})



//part posts
describe('Test Returns all public posts', () => {
	test('Should return 200 code when all public posts get', async () => {
		const res = await request(app).get('/posts')
		expect(res.statusCode).toEqual(200);
	});
});

//  /authors/:authorId/posts/  -- get
describe('Test Returns all posts of a user', () => {
	test('Returns all posts of a user by user id', async () => {
		const res = await request(app).get('/authors/' + id + '/posts/')
		expect(res.statusCode).toEqual(200);
	});
});

let postId = "";
let newPost ;
///authors/:authorId/posts/  -- post
describe('Test post a post', () => {
	const payload = {
		title: "test",
		source: "test",
		description: "test",
		contentType: "test",
		content: "test",
		categories: "test",
		visibility: "test",
		unlisted: true,
	}
	test('Test post a post by author', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).post('/authors/' + id + '/posts/')
			.set('Authorization', authorization)
			.send(payload);
		postId = res.body.id
		newPost = res.body;
		expect(res.statusCode).toEqual(201);
	});
});


let commentID;
//post comment in a post
describe('add comment in a post', () => {
	const payload = {
		contentType:'test',
		comment:"test"
	}
	test('add comment in a post', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).post('/authors/'+id+'/posts/'+postId+'/comments/')
		.set('Authorization', authorization)
		.send(payload);
		commentID = res.body.id;
		expect(res.statusCode).toEqual(201);
	});
});

let likeID;
/*describe('add likes', () => {
	const payload = {
		
	}
	test('add likes', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).post('/authors/'+id+'/posts/'+postId+'/likes')
		.set('Authorization', authorization)
		.send('/authors/'+id+'/posts/'+postId);
		likeID = res.body.id;
		expect(res.statusCode).toEqual(201);
	});
});*/

describe('get like', () => {
	test('get like', async () => {
		const res = await request(app).get('/authors/'+id+'/posts/'+postId+'/likes')
		expect(res.statusCode).toEqual(200);
	});
});


describe('get  authors likes', () => {
	test('get authors likes', async () => {
		const res = await request(app).get('/authors/'+id+'/liked')
		expect(res.statusCode).toEqual(200);
	});
});

describe('get  authors likes', () => {
	test('get authors likes', async () => {
		const res = await request(app).get('/authors/'+id+'/liked')
		expect(res.statusCode).toEqual(200);
	});
});

describe('get  authors likes', () => {
	test('get authors likes', async () => {
		const res = await request(app).get('/authors/'+id+'/posts/'+postId+'/comments/'+commentDd+'/likes')
		expect(res.statusCode).toEqual(200);
	});
});


describe('add inbox', () => {
	const payload = {
		type: "t",
		src: "t1",
		owner: "t1",
		likedAuthor: "t1",
	};
	test('add inbox', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).post('/authors/'+id+'/inbox')
		.set('Authorization', authorization)
		.type("json").send(payload)
		expect(res.statusCode).toEqual(201);
	});
});

describe('delete inbox', () => {
	test('delete inbox', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).delete('/authors/'+id+'/inbox')
		.set('Authorization', authorization)
		expect(res.statusCode).toEqual(200);
	});
});

describe('get  inbox', () => {
	test('get  inbox', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).get('/authors/'+id+'/inbox')
		.set('Authorization', authorization)
		expect(res.statusCode).toEqual(200);
	});
});



describe('get  followers', () => {
	test('get  followers', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).get('/authors/'+id+'/inbox')
		.set('Authorization', authorization)
		expect(res.statusCode).toEqual(200);
	});
});

describe('put  followers', () => {
	test('put  followers', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).put('/authors/'+id+'/followers/:foreignAuthorId')
		.set('Authorization', authorization)
		expect(res.statusCode).toEqual(200);
	});
});

describe('get  followers', () => {
	test('get  followers', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).get('/authors/'+id+'/inbox')
		.set('Authorization', authorization)
		expect(res.statusCode).toEqual(200);
	});
});
//
/*describe('Returns all comments by id', () => {
	test('Returns all comments by id ', async () => {
		const res = await request(app).get('/authors/'+id+'/posts/'+postId+'/comments/'+commentID)
		expect(res.statusCode).toEqual(200);
	});
});*/

describe('Returns all comments', () => {
	test('Returns all comments ', async () => {
		const res = await request(app).get('/authors/'+id+'/posts/'+postId+'/comments/')
		expect(res.statusCode).toEqual(200);
	});
});


//authors/:authorId/posts/:id -- get
describe('Test Returns a post by id', () => {
	test('Test Returns a post by id ', async () => {
		const res = await request(app).get('/authors/' + id + '/posts/' + postId)
		expect(res.statusCode).toEqual(200);
	});
});

///authors/:authorId/posts/:id/image  -- get
describe('Test Returns images of a post', () => {
	test('Test Returns images of a post', async () => {
		const res = await request(app).get('/authors/' + id + '/posts/' + postId + "/image")
		expect(res.statusCode).toEqual(404);
	});
});




///authors/:authorId/posts/:id  -- put
/*describe('Test put post by id', () => {
	const payload = {
		title: "test11",
		source: "test11",
		origin:"testtest",
		description: "test11",
		contentType: "test11",
		content: "test11",
		categories: "test11",
		visibility: "test11",
		unlisted: false,
	}
	test('Test put post by id', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).put('/authors/' + id + '/posts/'+ postId)
			.set('Authorization', authorization)
			.send(payload);
		postId = res.body.id
		expect(res.statusCode).toEqual(201);
	});
});*/



///authors/:authorId/posts/:id -- post
describe('Test update post by id', () => {
	test('Test update post by id', async () => {
		newPost["title"] = "test11";
		let  payload = newPost
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).post('/authors/' + id + '/posts/' + postId)
			.set('Authorization', authorization)
			.send(payload);
		postId = res.body.id
		expect(res.statusCode).toEqual(200);
	});
});



//authors/:authorId/posts/:id/image  -- post
/*describe('Test post image to a post', () => {
	test('Test post image to a post', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		const res = await request(app).post('/authors/' + id + '/posts/' + postId+"/image")
			.set('Authorization', authorization)
			.attach('file', 'logo512.png');
	});
});*/




//part likes

//part inbox

//part followers






///authors/:authorId/posts/:id  -- delete
/*describe('Test delete a post by id', () => {
	test('Test delete a post by id', async () => {
		let authorization = "Basic " + new Buffer.from(email + ":" + password).toString(
			"base64");
		delete newPost
		const res = await request(app)
		.delete('/authors/' + id + '/posts/' + postId)
		.set('Authorization', authorization)
		.type("json")
		.send({});
		expect(res.statusCode).toEqual(204);
	});
});*/


describe('Test admin user login in', () => {
	const payload = {
		email: "admintest123@example.com",
		password
	}
	test('Should return 201 code when logining', async () => {
		await createAdminAccount()
		const res = await request(app).post('/login')
			.type("json")
			.send(payload)
		expect(res.statusCode).toEqual(200);
		id = res.body.id;
		token = res.header["set-cookie"][0].split(';')[0].split('=')[1]
		Cookie = res.header["set-cookie"][0];
		//console.log("id", id);
		//console.log("token", token);
	});
})


// /nodes -- delete

describe('Test delete nodes ', () => {
	const payload = {
		type: 'receive',
		url: 'http://127.0.0.1',
	}
	test('Test delete nodes by delete method[/nodes]', async () => {
		const res = await request(app).delete('/nodes')
			.set("Cookie", Cookie)
			.type("json")
			.send(payload);
		expect(res.statusCode).toEqual(204);
	});
});




describe('Test user log out', () => {
	test('Should return 200 code when Usr log out', async () => {
		const res = await request(app).get('/logout')
		expect(res.statusCode).toEqual(401);
	});
})

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

/*describe('Test authors get without ID', () => {
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
});*/

/*
describe('Test posts delete with ID', () => {
	test('Should return 404 code when deleting posts', () => {
		return request(app).delete('/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/asd').expect(404);
	});
});
*/

/*
describe('Test comments get without ID', () => {
	test('Should return 200 code when getting comments', () => {
		return request(app).get('/authors/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/asd/comments').expect(200);
	});
});*/
