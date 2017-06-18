const Route = require('../../Route');
const Google = require('../../GoogleOAuth');

class AuthenticateGoogle extends Route {
	constructor(server) {
		super('/api/authenticate/google', server);
		this.google = new Google(server);
	}

	async post(req, res) {
		if (!req.params || !req.params.code) {
			throw this.error(400, `Parameter 'code' must be supplied.`);
		}
		try {
			var googleID = await this.google.getUserID(req.params.code);
		} catch (error) {
			throw this.error(401, `Invalid 'code' parameter`);
		}

		// See if the user already has an account
		try {
			var user = await this.data.db.oneOrNone('SELECT * FROM users WHERE google_id=$1', googleID);
			if (!user) {
				user = await this.data.db.one(
					'INSERT INTO users (username, google_id) VALUES ($1, $2) RETURNING *',
					['me too thanks', googleID]
				);
			}
		} catch (error) {
			this.server.logger.error(error);
			throw this.error(500, 'Error querying database.');
		}

		// Retrieve token for the user
		try {
			const token = await this.data.generateToken(user.id);
			res.send({
				token,
				user: {
					username: user.username,
					id: user.id
				}
			});
		} catch (error) {
			this.server.logger.error(error);
			throw this.error(500, 'Error generating token.');
		}
	}
}

module.exports = AuthenticateGoogle;
