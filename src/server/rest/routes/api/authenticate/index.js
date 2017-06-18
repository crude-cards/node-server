const Route = require('../../Route');

class Authenticate extends Route {
	constructor(parent) {
		super('/authenticate', parent);
	}
}

module.exports = Authenticate
