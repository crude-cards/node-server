class Message {
	constructor({ author, time, content, channel }) {
		this.author = author;
		this.time = time;
		this.content = content;
		this.channel = channel;
	}

	static async create(db, data) {
		data.author = await db.one('SELECT id, username FROM users WHERE id=$1', data.author);
		return new Message(data);
	}
}

module.exports = Message;
