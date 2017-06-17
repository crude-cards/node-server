const WebSocketServer = require('uws').Server;
const PACKET_HANDLERS = [
	'identify'
].map(file => require(`./handlers/${file}`));

class Gateway {
	constructor(cc_server) {
		this.cc_server = cc_server;
		this.wss = new WebSocketServer({
			server: cc_server.server,
			path: '/gateway'
		});
		this.wss.on('connection', this.event_connection.bind(this));
		this.verified = new Map();
		this.packet_handlers = new Map();
		for (const Handler of PACKET_HANDLERS) {
			const handler = new Handler(this);
			this.packet_handlers.set(handler.options.code, handler);
		}
	}

	disconnect_client(ws, code = 1000) {
		this.verified.delete(ws);
		ws.close(code);
	}

	event_connection(ws) {
		ws.on('message', message => this.event_message(ws, message));
	}

	event_message(ws, message) {
		let packet;
		try {
			packet = JSON.parse(message);
			if (!Object.getOwnPropertyDescriptor(packet, 't')) throw Error();
			if (!Number.isInteger(packet.t)) throw Error();
		} catch (err) {
			this.disconnect_client(ws);
			return;
		}
		this.event_packet(ws, packet);
	}

	async event_packet(ws, packet) {
		const handler = this.packet_handlers.get(packet.t);
		if (!handler) {
			this.disconnect_client(ws);
			return;
		}
		try {
			await handler.handle(ws, packet);
		} catch (error) {
			if (error.disconnect_code) {
				this.disconnect_client(ws, error.disconnect_code);
				return;
			}
			this.cc_server.logger.error(error);
		}
	}
}

module.exports = Gateway;
