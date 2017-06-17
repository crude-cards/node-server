const Route = require('./Route');
const Discord = require('../../../utils/DiscordOAuth');

class MetaRoute extends Route {
	constructor(rest) {
		super(rest, '/api/users/:id');
		this.discord = new Discord(this.cc_server);
	}

	async get(req, res) {
		this.authenticated(req);
		const target_id = Number(req.params.id);
		try {
			const user = await this.data.db.one('SELECT id, username FROM users WHERE id=$1', target_id);
			res.send({ user });
		} catch (error) {
			if (error.code === this.data.pgp.errors.queryResultErrorCode.noData) {
				throw this.error(404, 'User not found.');
			}
			throw error;
		}
	}

	async patch(req, res) {
		const user_id = this.authenticated(req);
		const target_id = Number(req.params.id);
		if (user_id !== target_id) throw this.error(403, 'You can only edit your own profile.');
		if (!req.params.username) throw this.error(400, 'Username must be specified.');
		const username = String(req.params.username);
		if (!username || username.length > 32) throw this.error(400, 'Username must be 32 characters at most.');
		const user = await this.data.db
			.one('UPDATE users SET username=$1 WHERE id=$2 RETURNING *', [username, target_id]);
		res.send({ user });
		this.cc_server.gateway.send({
			t: 11,
			d: { user: { id: user.id, username: user.username } }
		});
	}
}

module.exports = MetaRoute;
