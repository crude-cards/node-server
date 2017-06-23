const Collection = require('./Collection');
const User = require('../models/User');

class UserCollection extends Collection {
	async fetch(id) {
		if (this.has(id)) return this.get(id);
		const user = new User(this.store, await this.store.db.one('SELECT username, id FROM users WHERE id=$1', id));
		this.set(id, user);
		return user;
	}
}

module.exports = UserCollection;
