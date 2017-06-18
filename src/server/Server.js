const EventEmitter = require('events');
const Constants = require('../constants');
const restify = require('restify');
const Logger = require('../utils/Logger');
const DataStore = require('../data/DataStore');
const fs = require('fs');
const path = require('path');
const util = require('util');
const readDir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const Gateway = require('./gateway/Gateway');

/**
 * Represents a Crude Cards server (instantiate this!)
 */
class Server extends EventEmitter {
	constructor(options = {}) {
		super();
		this.options = options = Object.assign(options, Constants.defaultOptions);
		options.apiVersion = Constants.apiVersion;

		/**
		 * The logger for this server.
		 * @type {Logger}
		 */
		this.logger = new Logger();

		/**
		 * The server created by restify
		 * @type {Restify.Server}
		 */
		const rest = this.rest = restify.createServer({
			name: 'crudecards-nodejs',
			version: `${Constants.apiVersion}.0.0`,
			certificate: options.https.certificate,
			key: options.https.key
		});

		rest.use(restify.plugins.acceptParser(rest.acceptable));
		rest.use(restify.CORS()); // eslint-disable-line
		rest.use(restify.plugins.queryParser());
		rest.use(restify.plugins.bodyParser());

		rest.listen(443);

		/**
		 * The Data Store for this server.
		 * @type {DataStore}
		 */
		this.data = new DataStore(this);

		this.routes = new Set();
		this.loadRoutes(path.join(__dirname, './rest/routes/api'));

		this.gateway = new Gateway(this);
		this.rest.listen(443);
	}

	async loadRoutes(dir) {
		const files = await readDir(dir);
		files.forEach(async file => {
			file = path.join(dir, file);
			const stats = await stat(file);
			if (file.endsWith('.js') && !stats.isDirectory()) {
				const route = new (require(file))(this);
				this.routes.add(route);
				this.logger.info(`Loaded route ${route.path}`);
			} else if (stats.isDirectory()) {
				this.loadRoutes(file);
			}
		});
	}

	get players() {
		return this.gateway.wss.clients.length;
	}

	get games() {
		return 0;
	}
}

module.exports = Server;
