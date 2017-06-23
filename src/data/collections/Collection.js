const RESTError = require('../../server/rest/routes/RESTError');

class Collection extends Map {
	constructor(store) {
		super();
		Object.defineProperty(this, 'store', {
			value: store,
			enumerable: false,
			writable: false
		});
	}

	error(code, message) {
		return new RESTError(code, message);
	}
}

module.exports = Collection;
