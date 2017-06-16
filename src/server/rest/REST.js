const ROUTES = [
	'authenticate_discord'
].map(file => require(`./routes/${file}`));

class REST {
	constructor(cc_server) {
		this.cc_server = cc_server;
		this.data = this.cc_server.data;
		this.server = cc_server.server;

		for (const Route of Object.values(ROUTES)) {
			const route = new Route(this);
			for (const term of ['get', 'post', 'delete', 'patch', 'put']) {
				if (route[term]) {
					this.server[term](route.path, async (req, res, next) => {
						try {
							await route[term](req, res, next);
						} catch (error) {
							res.send(500, 'Unexpected internal error.');
							this.cc_server.logger.error(error);
						}
						next();
					});
				}
			}
		}
	}
}

module.exports = REST;
