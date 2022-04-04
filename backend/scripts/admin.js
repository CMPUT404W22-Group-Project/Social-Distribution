import prisma from '../prisma/client.js';
import readlineSync from 'readline-sync';

const command = readlineSync.questionInt(
	'1. Add admin\n2. Remove admin\n3. Exit\n> '
);

if (command === 1) {
	const email = readlineSync.question('Email: ');

	await prisma.author.update({
		where: {
			email: email,
		},
		data: {
			admin: true,
			activate: true,
		},
	});
	console.log(`> Admin ${email} added`);
} else if (command == 2) {
	const email = readlineSync.question('Email: ');

	await prisma.author.update({
		where: {
			email: email,
		},
		data: {
			admin: false,
		},
	});
	console.log(`> Admin ${email} removed`);
} else {
	process.exit();
}
