import Prisma from '@prisma/client';
let prisma;

try {
    // When app is run in dev
	prisma = new Prisma.PrismaClient();
} catch {
    // When app is run in test
	const Prisma = require('@prisma/client');
	prisma = new Prisma.PrismaClient();
}

export default prisma;
