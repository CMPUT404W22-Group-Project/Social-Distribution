import { followersService, nodesService } from '../services/index.service.js';
import axios from 'axios';

export async function getFollowers(req, res) {
	const followers = await getFollowersJSON({
		authorId: req.params.authorId,
		protocol: req.protocol,
		host: req.get('host'),
	});
	return res.status(200).json(followers);
}

export async function getFollowersJSON(options) {
	const { localFollowers, remoteFollowers } =
		await followersService.getFollowers(options.authorId, options.host);
	const host = `${options.protocol}://${options.host}`;

	localFollowers.forEach((follower) => {
		follower.type = 'author';
		follower.url = `${host}/authors/${follower.id}`;
		follower.id = `${host}/authors/${follower.id}`;
		follower.host = `${host}/`;
		delete follower.email;
		delete follower.password;
	});

	const followerList = localFollowers;
	for (const follower of remoteFollowers) {
		try {
			// TODO: Check nodes table for node and use basic auth
			const node = await nodesService.getNodeByUrl(follower.node);

			followerList.push(
				(
					await axios.get(`${node.url}/authors/follower.authorId`, {
						auth: { username: node.username, password: node.password },
					})
				).data
			);
		} catch (err) {
			console.error(`${err.message} on ${follower.authorId}`);
		}
	}

	const followers = {
		type: 'followers',
		items: followerList,
	};

	return followers;
}

export async function deleteFollower(req, res) {
	await followersService.deleteFollower({
		authorId: req.params.foreignAuthorId,
		followingId: req.params.authorId,
	});
	return res.sendStatus(204);
}

export async function addFollower(req, res) {
	const node = req.body.node ? req.body.node : null;
	if (req.user.id !== req.params.authorId) {
		return res.sendStatus(401);
	}

	const result = await followersService.addFollower({
		authorId: req.params.foreignAuthorId,
		followingId: req.params.authorId,
		node: node,
	});
	if (!result) {
		return res.status(400).json({ error: 'failed to add follower' });
	}
	// TODO: Add follower to inbox

	return res.sendStatus(201);
}

export async function checkIsFollower(req, res) {
	const isFollower = await followersService.checkIsFollower(
		req.params.foreignAuthorId,
		req.params.authorId
	);
	return res.status(200).json(isFollower);
}
