const PacketHandler = require('./PacketHandler');

class IdentifyHandler extends PacketHandler {
	constructor(gateway) {
		super(gateway, { code: 0, body: true });
	}

	handle(ws, packet) {
		super.handle(ws, packet);

		// TODO: Add 'resume' handling
		if (this.gateway.verified.has(ws)) throw this.clientError('Already authenticated', 4001);

		const userID = this.gateway.server.data.tokens.get(packet.d.token);
		if (!userID) throw this.clientError('Invalid token', 4001);

		this.gateway.verified.set(ws, {
			userID,
			heartbeatsMissed: 0
		});
	}
}

module.exports = IdentifyHandler;
