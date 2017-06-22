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

		const user = new ConnectedUser(this.gateway.server.data, userID, ws);
		this.gateway.server.data.connectedUsers.set(userID, user);
		this.gateway.userMap.set(ws, user);
		try {
			this.sendReady(user);
		} catch (error) {
			this.gateway.server.logger.error(error);
			this.gateway.disconnectClient(ws, 1006);
		}
	}

	async sendReady(connectedUser) {
		const user = await this.gateway.server.data.db.one('SELECT * FROM users WHERE id=$1', connectedUser.id);
		connectedUser.ws.send(JSON.stringify({
			t: 2,
			d: {
				heartbeat: 60e3,
				user,
				resumed: false
			}
		}));
	}
}

module.exports = IdentifyHandler;
