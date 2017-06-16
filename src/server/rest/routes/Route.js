class Route {
	constructor(rest, path) {
		this.rest = rest;
		this.path = path;
		this.cc_server = rest.cc_server;
		this.data = this.cc_server.data;
	}

	send_error(res, code, message) {
		res.send(code, { message });
	}
}

module.exports = Route;
