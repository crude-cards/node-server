const Route = require('../../Route');
const Discord = require('../../DiscordOAuth');

class AuthenticationDiscord extends Route {
	constructor(server) {
		super('/api/authentications/discord', server);
		this.discord = new Discord(this.server);
	}

	async post(req, res) {
		const userID = this.ensureAuthorized(req);

		if (!req.params.code) {
			throw this.error(400, `Parameter 'code' must be supplied.`);
		}

		// Fetch discord details from OAuth code
		try {
			var discordID = await this.discord
				.token(req.params.code)
				.then(tokenData => this.discord.details(tokenData.access_token))
				.then(data => data.id);
		} catch (error) {
			if (error.status === 401) {
				throw this.error(401, `Invalid 'code' parameter supplied`);
			}
			throw error;
		}

		try {
			var user = await this.data.db.one('UPDATE users SET discord_id=$1 WHERE id=$2 RETURNING *', [discordID, userID]);
		} catch (error) {
			if (error.code === '23505') {
				throw this.error(400, 'Discord account is already linked.');
			}
			this.server.logger.error(error);
			throw this.error(500, 'Error querying database.');
		}

		res.send({ user });
	}

	async del(req, res) {
		const userID = this.ensureAuthorized(req);
		try {
			var user = await this.data.db.one('UPDATE users SET discord_id=NULL WHERE id=$1 RETURNING *', userID);
		} catch (error) {
			if (error.code === '23514') {
				throw this.error(400, 'You must have at least one authentication.');
			}
			throw this.error(500, 'Error querying database.');
		}
		res.send({ user });
	}
}

module.exports = AuthenticationDiscord;
