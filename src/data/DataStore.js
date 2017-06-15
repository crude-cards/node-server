const pgp = require('pg-promise')();
const crypto = require('crypto');
const { promisify } = require('util');
const random_bytes = promisify(crypto.randomBytes);

class DataStore {
	constructor(server) {
		this.server = server;
		this.logger = server.logger;
		const config = this.server.options.database;
		this.logger.info('Connecting to database...');
		this.db = pgp({
			host: config.host,
			port: config.port,
			database: 'crude_cards',
			user: config.username,
			password: config.password
		});

		this._tokens = new Map();
	}

	async generate_token(user_id) {
		const existing = this.token_for(user_id);
		if (existing) return existing;
		const token = `${(await random_bytes(16)).toString('hex')}-${user_id}`;
		this._tokens.set(token, user_id);
		return token;
	}

	token_for(wanted_user_id) { // eslint-disable-line consistent-return
		for (const [token, user_id] of this._tokens.entries()) {
			if (wanted_user_id === user_id) return token;
		}
	}
}

module.exports = DataStore;
