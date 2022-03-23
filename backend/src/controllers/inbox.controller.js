import { inboxService } from '../services/index.service.js';

/**
 * Get an author's inbox
 * @param {Express.Request} req
 * @param {Express.Response} res
 * TODO: Get posts, comments, likes, and follows from the inbox items
 */
export async function getInbox(req, res) {
    const items = await inboxService.getInbox({
        id: req.params.id,
        page: parseInt(req.query.page),
        size: parseInt(req.query.size),
    });
    const host = `${req.protocol}://${req.get('host')}`;
    const inbox = {
        type: 'inbox',
        author: `${host}/authors/${req.params.id}`,
        items: items,
    };

    return res.status(200).json({ inbox });
}

export async function postToInbox() { }

/**
 * Clear the user's inbox
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns 
 */
export async function deleteInbox(req, res) {
    await inboxService.clearInbox(req.params.id);
    return res.sendStatus(204);
}
