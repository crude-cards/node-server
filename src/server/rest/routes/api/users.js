const Route = require('../../Route');

class Users extends Route {
	constructor(parent) {
		super('/users/:id', parent);
	}

	async get(req, res) {
		this.ensureAuthorized(req);

		const userID = Number(req.params.id);
		try {
			const user = await this.data.db.one('SELECT id, username FROM users WHERE id=$1', userID);
			res.send({ user });
		} catch (error) {
			if (error.code === this.data.pgp.errors.queryResultErrorCode.noData) {
				throw this.error(404, 'User not found.');
			}
			throw error;
		}
	}

	async patch(req, res) {
		const userID = Number(req.params.id);
		if (this.ensureAuthorized(req) !== userID) throw this.error(403, 'You can only edit your own profile.');

		if (!req.params.username) throw this.error(400, 'Username must be specified.');
		const username = String(req.params.username);

		if (!username || username.length > 32) throw this.error(400, 'Username must be 32 characters at most.');

		const user = await this.data.db
			.one('UPDATE users SET username=$1 WHERE id=$2 RETURNING *', [username, userID]);

		res.send({ user });
		this.server.gateway.send({
			t: 11,
			d: { user: { id: user.id, username: user.username } }
		});
	}
}

module.exports = Users;
