import { nodesService } from '../services/index.service.js';

export async function addNode(req, res) {
	const node = req.body;
	const newNode = await nodesService.addNode(node);
	return res.status(201).json(newNode);
}

export async function removeNode(req, res) {
	const node = req.body;
	await nodesService.removeNode(node);
	return res.sendStatus(204);
}

export async function getNode(req, res) {
	const node = await nodesService.getNode(req.body.url);
	return res.sendStatus(200).json(node);
}
