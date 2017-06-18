const EventEmitter = require('events');
const Constants = require('../constants');
const restify = require('restify');
const Logger = require('../utils/Logger');
const DataStore = require('../data/DataStore');
const API = require('./rest/routes/api');
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
		this.api = new API(this);
		this.gateway = new Gateway(this);
		this.rest.listen(443);
	}

	get players() {
		return this.gateway.wss.clients.length;
	}

	get games() {
		return 0;
	}
}

module.exports = Server;
