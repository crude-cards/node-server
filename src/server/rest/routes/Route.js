const METHODS = ['get', 'post', 'del', 'patch', 'put'];
const RESTError = require('./RESTError');

class Route {
	constructor(path, server) {
		this.path = path;
		this.server = server;
		this.data = this.server.data;

		for (const method of METHODS) {
			const handler = this[method];
			if (!handler) continue;
			this.server.rest[method](this.path, async (req, res, next) => {
				res.charSet('utf-8');
				try {
					await handler.apply(this, [req, res, next]);
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
