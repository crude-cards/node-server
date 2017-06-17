const EventEmitter = require('events');
const constants = require('../constants');
const restify = require('restify');
const Logger = require('../utils/Logger');
const DataStore = require('../data/DataStore');
const REST = require('./rest/REST');
const Gateway = require('./gateway/Gateway');

/**
 * Represents a Crude Cards server (instantiate this!)
 */
class Server extends EventEmitter {
	constructor(options = {}) {
		super();
		this.options = options = Object.assign(options, constants.default_options);
		options.api_version = constants.api_version;
		/**
		 * The logger for this server.
		 * @type {Logger}
		 */
		this.logger = new Logger();
		/**
		 * The server created by restify
		 * @type {Restify.Server}
		 */
		const server = this.server = restify.createServer({
			name: 'crudecards-nodejs',
			version: `${constants.api_version}.0.0`,
			certificate: options.https.certificate,
			key: options.https.key
		});
		server.use(restify.plugins.acceptParser(server.acceptable));
		server.use(restify.CORS()); // eslint-disable-line
		server.use(restify.plugins.queryParser());
		server.use(restify.plugins.bodyParser());
		server.listen(443);
		/**
		 * The Data Store for this server.
		 * @type {DataStore}
		 */
		this.data = new DataStore(this);
		/**
		 * REST
		 * @type {REST}
		 */
		this.rest = new REST(this);
		this.gateway = new Gateway(this);
		this.server.listen(443);
	}
}

module.exports = Server;
