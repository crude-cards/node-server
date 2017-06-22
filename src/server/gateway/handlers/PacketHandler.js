class GatewayClientError extends Error {
	constructor(message, code) {
		super(message);
		this.disconnectCode = code;
	}
}

class PacketHandler {
	constructor(gateway, options) {
		this.gateway = gateway;
		this.options = options;
	}

	clientError(message, code) {
		return new GatewayClientError(message, code);
	}

	handle(ws, packet) {
		if (this.options.auth && !this.gateway.userMap.has(ws)) {
			throw new GatewayClientError('Client not yet authenticated', 4001);
		}
		if (this.options.body && !packet.d) {
			throw new GatewayClientError('Packet needs body', 4001);
		}
	}
}

module.exports = PacketHandler;
