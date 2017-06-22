const RESTError = require('../../server/rest/routes/RESTError');

class Collection extends Map {
	constructor(store) {
		super();
		this.store = store;
	}

	error(code, message) {
		return new RESTError(code, message);
	}
}

module.exports = Collection;
