class GatewayClientError extends Error {
	constructor(message, code) {
		super(message);
		this.disconnect_code = code;
	}
}

class PacketHandler {
	constructor(gateway, options) {
		this.gateway = gateway;
		this.options = options;
	}

	throw_client_error(message, code) {
		throw new GatewayClientError(message, code);
	}

	handle(ws, packet) {
		if (this.options.auth && !this.gateway.verified.has(ws)) {
			throw new GatewayClientError('Client not yet authenticated', 4001);
		}
		if (this.options.body && !packet.d) {
			throw new GatewayClientError('Packet needs body', 4001);
		}
	}
}

module.exports = PacketHandler;
