const fs = require('fs');
const path = require('path');

const METHODS = ['get', 'post', 'delete', 'patch', 'put'];

class RESTError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
}

class Route {
	constructor(subpath, parent) {
		this.path = parent.path + subpath;
		this.subroutes = [];

		if (parent) {
			this.server = parent.server;
			this.data = this.server.data;

			this.init();
		}

		for (const file of fs.readdirSync(__dirname)) {
			const filePath = path.join(__dirname, file);
			if (filePath === __filename) continue;

			const ChildRoute = require(path.join(__dirname, file));
			this.subroutes.push(new ChildRoute(this));
		}
	}

	init() {
		for (const method of METHODS) {
			const handler = this[method];
			if (!handler) continue;

			this.server[method](this.path, async (req, res, next) => {
				res.charSet('utf-8');
				try {
					await handler(req, res, next);
				} catch (error) {
					if (error instanceof RESTError) {
						res.send(error.code, { message: error.message });
					} else {
						res.send(500, { message: 'Unexpected internal error.' });
						this.server.logger.error(error);
					}
				}
				next();
			});
		}
	}

	error(code, message) {
		return new RESTError(code, message);
	}

	ensureAuthorized(req) {
		if (!req.headers || !req.headers.authorization) throw this.error(401, 'Invalid authorization.');
		const user = this.data.tokens.get(req.headers.authorization);
		if (!user) throw this.error(401, 'Invalid authorization');
		return user;
	}
}

Route.RESTError = RESTError;

module.exports = Route;
