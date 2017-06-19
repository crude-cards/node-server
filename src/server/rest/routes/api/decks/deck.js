const Route = require('../../Route');

class Deck extends Route {
	constructor(server) {
		super('/api/decks/:id', server);
	}

	async get(req, res) {
		const { id } = req.params;

		const deck = await this.data.db.oneOrNone('SELECT * FROM decks WHERE id=$1', id);
		if (!deck) throw this.error(404, 'Deck does not exist.');

		res.send({ deck });
	}

	async delete(req, res) {
		const { id } = req.params;

		const deck = await this.data.db.oneOrNone('DELETE FROM decks WHERE id=$1 RETURNING *', id);
		if (!deck) throw this.error(404, 'Deck does not exist.');

		res.status(204).send();
	}
}

module.exports = Deck;
