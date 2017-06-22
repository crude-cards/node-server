const PacketHandler = require('./PacketHandler');

class IdentifyHandler extends PacketHandler {
	constructor(gateway) {
		super(gateway, { code: 1, auth: true });
	}

	handle(ws, packet) {
		super.handle(ws, packet);
		this.gateway.userMap.get(ws).heartbeatsMissed = 0;
	}
}

module.exports = IdentifyHandler;
