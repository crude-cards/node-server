const pgp = require('pg-promise')();

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
	}
}

module.exports = DataStore;
