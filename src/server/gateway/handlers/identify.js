const PacketHandler = require('./PacketHandler');
const ConnectedUser = require('../../../data/models/ConnectedUser');

class IdentifyHandler extends PacketHandler {
	constructor(gateway) {
		super(gateway, { code: 0, body: true });
	}

	handle(ws, packet) {
		super.handle(ws, packet);

		// TODO: Add 'resume' handling
		if (this.gateway.userMap.has(ws)) throw this.clientError('Already authenticated', 4001);

		const userID = this.gateway.server.data.tokens.get(packet.d.token);
		if (!userID) throw this.clientError('Invalid token', 4001);

		const user = new ConnectedUser(userID, ws);
		this.gateway.server.data.connectedUsers.set(userID, user);
		this.gateway.userMap.set(ws, user);
	}
}

module.exports = IdentifyHandler;
