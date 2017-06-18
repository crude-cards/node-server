const Route = require('../../Route');
const Google = require('../../GoogleOAuth');

class AuthenticationGoogle extends Route {
	constructor(server) {
		super('/api/authentications/google', server);
		this.google = new Google(server);
	}

	async post(req, res) {
		const userID = this.ensureAuthorized(req);

		if (!req.params.code) {
			throw this.error(400, `Parameter 'code' must be supplied.`);
		}

		try {
			var googleID = await this.google.getUserID(req.params.code);
		} catch (error) {
			console.log(error);
			throw this.error(401, `Invalid 'code' parameter`);
		}

		try {
			var user = await this.data.db.one('UPDATE users SET google_id=$1 WHERE id=$2 RETURNING *', [googleID, userID]);
		} catch (error) {
			if (error.code === '23505') {
				throw this.error(400, 'Google account is already linked.');
			}
			this.server.logger.error(error);
			throw this.error(500, 'Error querying database.');
		}

		res.send({ user });
	}

	async del(req, res) {
		const userID = this.ensureAuthorized(req);
		try {
			var user = await this.data.db.one('UPDATE users SET google_id=NULL WHERE id=$1 RETURNING *', userID);
		} catch (error) {
			if (error.code === '23514') {
				throw this.error(400, 'You must have at least one authentication.');
			}
			throw this.error(500, 'Error querying database.');
		}
		res.send({ user });
	}
}

module.exports = AuthenticationGoogle;
