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
