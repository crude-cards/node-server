const Route = require('./Route');
const Discord = require('../../../utils/DiscordOAuth');

class AuthenticateDiscord extends Route {
	constructor(parent) {
		super('/discord', parent);
		this.discord = new Discord(this.server);
	}

	async post(req, res) {
		if (!req.params || !req.params.code) {
			throw this.error(400, `Parameter 'code' must be supplied.`);
		}

		// Fetch discord details from OAuth code
		try {
			var discordDetails = await this.discord
				.token(req.params.code)
				.then(tokenData => this.discord.details(tokenData.access_token));
		} catch (error) {
			if (error.status === 401) {
				throw this.error(401, `Invalid 'code' parameter supplied`);
			}
			throw error;
		}

		// See if the user already has an account
		let user;
		try {
			user = await this.data.db.oneOrNone('SELECT * FROM users WHERE discord_id=$1', discordDetails.id);
			if (!user) {
				user = await this.data.db.one(
					'INSERT INTO users (username, discord_id) VALUES ($1, $2) RETURNING *',
					[discordDetails.username.substring(0, 32), discordDetails.id]
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

module.exports = AuthenticateDiscord;
