class ConnectedUsers {
	constructor(store, id, ws) {
		this.store = store;
		this.id = id;
		this.ws = ws;
		this.heartbeatsMissed = 0;
	}

	remove() {
		this.store.connectedUsers.delete(this.id);
		this.store.server.gateway.userMap.delete(this.ws);
		for (const channel of this.store.channels.values()) {
			channel.delete(this);
		}
	}
}

module.exports = ConnectedUsers;
