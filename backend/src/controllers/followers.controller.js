import { followersService } from '../services/index.service.js';
import axios from 'axios';

export async function getFollowers(req, res) {
	const { localFollowers, remoteFollowers } =
		await followersService.getFollowers(req.params.authorId);
	const host = `${req.protocol}://${req.get('host')}`;

	localFollowers.forEach((follower) => {
		follower.type = 'author';
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
			followerList.push((await axios.get(follower.authorId)).data);
		} catch {
			console.log('Unable to get follower information');
		}
	}

	const followers = {
		type: 'followers',
		items: followerList,
	};

	return res.status(200).json(followers);
}

export async function deleteFollower(req, res) {
	await followersService.deleteFollower(
		req.params.foreignAuthorId,
		req.params.authorId
	);
	return res.sendStatus(204);
}

export async function addFollower(req, res) {
	if (req.user.id !== req.params.foreignAuthorId) {
		return res.sendStatus(401);
	}

	await followersService.addFollower(
		req.params.foreignAuthorId,
		req.params.authorId
	);
	return res.sendStatus(204);
}

export async function checkIsFollower(req, res) {
	const isFollower = await followersService.checkIsFollower(
		req.params.foreignAuthorId,
		req.params.authorId
	);
	return res.status(200).json(isFollower);
}
