const WebSocketServer = require('uws').Server;
const PACKET_HANDLERS = [
	'identify',
	'heartbeat'
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
		this.heartbeat_sweep_interval = setInterval(this.heartbeat_sweep.bind(this), 1e3);
	}

	heartbeat_sweep() {
		for (const [ws, entry] of this.verified.entries()) {
			entry.heartbeats_missed++;
			if (entry.heartbeats_missed > 2) {
				this.disconnect_client(ws, 4001);
			}
		}
	}

	disconnect_client(ws, code = 1000) {
		this.verified.delete(ws);
		ws.close(code);
	}

	event_connection(ws) {
		ws.on('message', message => this.event_message(ws, message));
		setTimeout(() => {
			if (!this.verified.has(ws)) this.disconnect_client(ws);
		}, 15e3);
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
			this.disconnect_client(ws, 1006);
		}
	}
}

module.exports = Gateway;
