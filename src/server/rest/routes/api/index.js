const Route = require('../Route');

class API extends Route {
	constructor(server) {
		super('/api');
		this.server = server;

		this.init();
	}
}

module.exports = API;
