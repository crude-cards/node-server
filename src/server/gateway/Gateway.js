const WebSocketServer = require('uws').Server;

class Gateway {
	constructor(cc_server) {
		this.cc_server = cc_server;
		this.wss = new WebSocketServer({
			server: cc_server.server,
			path: '/gateway'
		});
	}
}

module.exports = Gateway;
