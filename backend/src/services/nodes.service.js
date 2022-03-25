import prisma from '../../prisma/client.js';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export async function addNode(node) {
	try {
		return await prisma.nodes.create({
			data: {
				type: node.type,
				url: node.url,
				username: node.username,
				password: node.password,
			},
		});
	} catch {
		return null;
	}
}

export async function removeNode(node) {
	try {
		return await prisma.nodes.delete({
			where: {
				type_url: {
					type: node.type,
					url: node.url,
				},
			},
		});
	} catch {
		return null;
	}
}

export async function getNode() {
	return await prisma.nodes.findMany({
		where: {
			type: 'send',
		},
	});
}

export async function getNodeByUrl(url) {
	return await prisma.nodes.findUnique({
		where: {
			url: url,
		},
	});
}

export async function getAllNodes() {
	const nodes = await prisma.nodes.findMany();
	return nodes;
}
