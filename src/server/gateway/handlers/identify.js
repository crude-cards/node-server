const PacketHandler = require('./PacketHandler');

class IdentifyHandler extends PacketHandler {
	constructor(gateway) {
		super(gateway, 0);
	}

	handle(ws, packet) {
		if (this.gateway.verified.has(ws)) {
			this.gateway.disconnect_client(ws);
			return;
		}
	}
}

module.exports = IdentifyHandler;
