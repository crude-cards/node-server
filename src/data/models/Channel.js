class Channel extends Set {
	send(packet) {
		const data = JSON.stringify(packet);
		for (const connectedUser of this.values()) {
			connectedUser.ws.send(data);
		}
	}
}

module.exports = Channel;
