const PacketHandler = require('./PacketHandler');

class IdentifyHandler extends PacketHandler {
	constructor(gateway) {
		super(gateway, { code: 0, body: true });
	}

	handle(ws, packet) {
		super.handle(ws, packet);
		// TODO: Add 'resume' handling
		if (this.gateway.verified.has(ws)) this.throw_client_error('Already authenticated', 4001);
		const user_id = this.gateway.cc_server.data.tokens.get(packet.d.token);
		if (!user_id) this.throw_client_error('Invalid token', 4001);
		this.gateway.verified.set(ws, {
			user_id,
			heartbeats_missed: 0
		});
	}
}

module.exports = IdentifyHandler;
