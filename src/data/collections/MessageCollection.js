const Collection = require('./Collection');
const { Message } = require('../models');

class MessageCollection extends Collection {
	async add(channel, data) {
		// Verify data
		channel = parseInt(channel);
		if (!data.content) throw this.error(400, 'Content must be specified');
		data.content = String(data.content);

		if (channel !== -1 && !this.store.channels.has(channel)) throw this.error(404, `Channel '${channel}' is invalid.`);
		if (data.content.length > 2000) throw this.error(400, `Content must be less than 2000 characters.`);

		// Cache message
		const message = await Message.create(this.store.db, data);
		if (!this.has(channel)) this.set(channel, new Set());
		const entries = this.get(channel);
		if (entries.size > 200) entries.delete(entries.values().next().value);
		this.get(channel).add(message);

		return message;
	}
}

module.exports = MessageCollection;
