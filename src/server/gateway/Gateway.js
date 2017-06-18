const WebSocketServer = require('uws').Server;
const PACKET_HANDLERS = [
	'identify',
	'heartbeat'
].map(file => require(`./handlers/${file}`));

class Gateway {
	constructor(server) {
		this.server = server;
		this.wss = new WebSocketServer({
			server: server.rest,
			path: '/gateway'
		});

		this.wss.on('connection', this.onConnection.bind(this));

		this.verified = new Map();
		this.packetHandlers = new Map();

		for (const Handler of PACKET_HANDLERS) {
			const handler = new Handler(this);
			this.packetHandlers.set(handler.options.code, handler);
		}

		this.heartbeatInterval = setInterval(this.heartbeat.bind(this), 40e3);
	}

	send(packet) {
		const raw = JSON.stringify(packet);
		for (const ws of this.verified.keys()) {
			ws.send(raw);
		}
	}

	heartbeat() {
		for (const [ws, entry] of this.verified.entries()) {
			entry.heartbeatsMissed++;
			if (entry.heartbeatsMissed > 2) {
				this.disconnectClient(ws, 4001);
			}
		}
	}

	disconnectClient(ws, code = 1000) {
		this.verified.delete(ws);
		ws.close(code);
	}

	onConnection(ws) {
		ws.on('message', message => this.onMessage(ws, message));
		setTimeout(() => {
			if (!this.verified.has(ws)) this.disconnectClient(ws);
		}, 15e3);
	}

	onMessage(ws, message) {
		try {
			var packet = JSON.parse(message);
			if (!Object.getOwnPropertyDescriptor(packet, 't')) throw new Error();
			if (!Number.isInteger(packet.t)) throw new Error();
		} catch (err) {
			this.disconnectClient(ws);
			return;
		}
		this.onPacket(ws, packet);
	}

	async onPacket(ws, packet) {
		const handler = this.packetHandlers.get(packet.t);
		if (!handler) {
			this.disconnectClient(ws);
			return;
		}
		try {
			await handler.handle(ws, packet);
		} catch (error) {
			if (error.disconnectCode) {
				this.disconnectClient(ws, error.disconnectCode);
				return;
			}
			this.server.logger.error(error);
			this.disconnectClient(ws, 1006);
		}
	}
}

module.exports = Gateway;
