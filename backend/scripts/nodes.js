import prisma from '../prisma/client.js';
import readlineSync from 'readline-sync';

const command = readlineSync.questionInt('1. Add a node\n2. Remove a node\n3. Exit\n> ');

if (command === 1) {
	const type = readlineSync.question('  Type (send/receive): ');
	const url = readlineSync.question('  URL: ');
	const username = readlineSync.question('  Username: ');
	const password = readlineSync.question('  Password: ');

	await prisma.nodes.create({
		data: {
			type: type,
			url: url,
			username: username,
			password: password,
		},
	});
	console.log(`> Node ${url} added`);
} else if (command == 2) {
	const url = readlineSync.question('URL: ');

	await prisma.nodes.delete({
		where: {
			url: url,
		},
	});
	console.log(`> Node ${url} removed`);
} else {
    process.exit();
}