const Discord = require('../utils/DiscordOAuth');

class REST {
	constructor(cc_server) {
		this.cc_server = cc_server;
		this.data = this.cc_server.data;
		const server = this.server = cc_server.server;

		server.post('/api/authenticate/discord', async (req, res, next) => {
			if (req.params) {
				const code = req.params.code;
				try {
					const discord_token = (await Discord.token(this.cc_server.options.discord, code)).access_token;
					const details = await Discord.details(discord_token);
					let user = await this.data.db.oneOrNone('SELECT * FROM users WHERE discord_id=$1', details.id);
					if (!user) {
						user = await this.data.db.one(
							'INSERT INTO users (username, discord_id) VALUES ($1, $2) RETURNING *',
							[details.username.substring(0, 32), details.id]
						);
					}
					const token = await this.data.generate_token(user.id);
					res.send(200, {
						token,
						user: { username: user.username, id: user.id }
					});
				} catch (err) {
					if (err.status === 401) {
						res.send(401, { message: 'Bad authorization code provided' });
						return next();
					}
					res.send(500, { message: err.message });
					this.cc_server.logger.error(err);
				}
			}
			return next();
		});
	}
}

module.exports = REST;
