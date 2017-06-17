class RESTError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
}

class Route {
	constructor(rest, path) {
		this.rest = rest;
		this.path = path;
		this.cc_server = rest.cc_server;
		this.data = this.cc_server.data;
	}

	error(code, message) {
		return new RESTError(code, message);
	}

	authenticated(req) {
		if (!req.headers || !req.headers.authorization) throw this.error(401, 'Invalid authorization.');
		const user = this.data.tokens.get(req.headers.authorization);
		if (!user) throw this.error(401, 'Invalid authorization');
		return user;
	}
}

Route.RESTError = RESTError;

module.exports = Route;
