import prisma from '../../prisma/client.js';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export async function addNode(node) {
	return await prisma.nodes.create({
		data: {
			type: node.type,
			url: node.url,
			username: node.username,
			password: node.password,
		},
	});
}

export async function removeNode(node) {
	return await prisma.nodes.delete({
		where: {
			type_url: {
				type: node.type,
				url: node.url,
			},
		},
	});
}

export async function getNode() {
	try {
		return await prisma.nodes.findMany({
			where: {
				type: 'send',
			},
		});
	} catch {
		return null;
	}
}
export async function getAllNodes() {
	const nodes = await prisma.nodes.findMany();
	return nodes;
}
