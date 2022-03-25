import { nodesService } from '../services/index.service.js';

export async function addNode(req, res) {
	const node = req.body;
	const newNode = await nodesService.addNode(node);
	if (newNode === null) {
		return res.status(400);
	}
	return res.status(201).json(newNode);
}

export async function removeNode(req, res) {
	const node = req.body;
	if ((await nodesService.removeNode(node)) === null) {
		return res.status(400);
	}
	return res.sendStatus(204);
}

export async function getNode(req, res) {
	const nodes = await nodesService.getNode();
	return res.status(200).json(nodes);
}

export async function getAllNode(req, res) {
	const nodes = await nodesService.getAllNodes();
	return res.status(200).json(nodes);
}
