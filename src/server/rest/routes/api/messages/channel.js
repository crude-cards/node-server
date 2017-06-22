const Route = require('../../Route');

class Meta extends Route {
	constructor(server) {
		super('/api/messages/:channel', server);
	}

	get(req, res) {
		const channel = parseInt(req.params.channel);
		if (channel !== -1 && !this.server.games.has(channel)) throw this.error(404, `Channel '${channel}' not found.`);
		const messages = Array.from(this.server.data.messages.get(parseInt(req.params.channel))) || [];
		res.send({ messages });
	}

	async post(req, res) {
		const author = this.ensureAuthorized(req);
		const { channel, content } = req.params;
		res.send({
			message: await this.server.data.messages.add(channel, { content, author, time: new Date().toISOString() })
		});
	}
}

module.exports = Meta;
