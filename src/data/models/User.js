const Base = require('./Base');

class User extends Base {
	constructor(store, { username, id }) {
		super(store);
		this.username = username;
		this.id = id;
	}

	async edit({ username }) {
		await this.store.db.none('UPDATE users SET username=$1 WHERE id=$2', [username, this.id]);
		this.username = username;
		return this;
	}

	static create(store, data) {
		return new User(store, data);
	}

	get token() {
		return this.store.tokenFor(this.id);
	}
}

module.exports = User;
