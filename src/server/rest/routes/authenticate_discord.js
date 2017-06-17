const Route = require('./Route');
const Discord = require('../../../utils/DiscordOAuth');

class AuthenticateDiscordRoute extends Route {
	constructor(rest) {
		super(rest, '/api/authenticate/discord');
		this.discord = new Discord(this.cc_server);
	}

	async post(req, res) {
		if (!req.params || !req.params.code) {
			this.send_error(res, 400, `Parameter 'code' must be supplied.`);
			return;
		}
		// Fetch discord details from OAuth code
		let discord_details;
		try {
			discord_details = await this.discord
				.token(req.params.code)
				.then(token_details => this.discord.details(token_details.access_token));
		} catch (error) {
			if (error.status === 401) {
				this.send_error(res, 401, `Invalid 'code' parameter supplied`);
				return;
			}
			throw error;
		}

		// See if the user already has an account
		let user;
		try {
			user = await this.data.db.oneOrNone('SELECT * FROM users WHERE discord_id=$1', discord_details.id);
			if (!user) {
				user = await this.data.db.one(
					'INSERT INTO users (username, discord_id) VALUES ($1, $2) RETURNING *',
					[discord_details.username.substring(0, 32), discord_details.id]
				);
			}
		} catch (error) {
			this.cc_server.logger.error(error);
			this.send_error(res, 500, 'Error querying database.');
			return;
		}

		// Retrieve token for the user
		try {
			const token = await this.data.generate_token(user.id);
			res.send({
				token,
				user: {
					username: user.username,
					id: user.id
				}
			});
		} catch (error) {
			this.cc_server.logger.error(error);
			this.send_error(res, 500, 'Error generating token.');
		}
	}
}

module.exports = AuthenticateDiscordRoute;
