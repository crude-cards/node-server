const Base = require('./Base');

class Message extends Base {
	constructor(store, { author, time, content, channel }) {
		super(store);
		this.author = author;
		this.time = time;
		this.content = content;
		this.channel = channel;
	}

	static async create(store, data) {
		data.author = await store.users.fetch(data.author);
		return new Message(store, data);
	}
}

module.exports = Message;
