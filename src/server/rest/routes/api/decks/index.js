const Route = require('../../Route');
const cardcast = require('cardcast');

class Decks extends Route {
	constructor(server) {
		super('/api/decks', server);
	}

	async get(req, res) {
		const decks = await this.data.db.manyOrNone('SELECT * FROM decks WHERE cardcast_id=-1');
		res.send({ decks });
	}

	async post(req, res) {
		const { cardcast_id } = req.params;
		if (!cardcast_id) {
			throw this.error(404, `Parameter 'cardcast_id' must be supplied.`);
		}

		try {
			var existingDeck = await this.data.db.oneOrNone('SELECT * FROM decks WHERE cardcast_id=$1', cardcast_id);
		} catch (error) {
			this.server.logger.error(error);
			throw this.error(500, 'Error querying database.');
		}

		try {
			var deckInfo = await cardcast(cardcast_id).info();
			var deckResponses = await cardcast(cardcast_id).responses();
			var deckCalls = await cardcast(cardcast_id).calls();
		} catch (error) {
			throw this.error(404, 'Deck not accessible on Cardcast.');
		}

		const name = deckInfo.name.substring(0, 32);
		const white_cards = deckResponses.map(card => card.text.join('').substring(0, 500));
		const black_cards = deckCalls.map(card => card.text.join('_').substring(0, 500));

		const deckData = [cardcast_id, name, white_cards, black_cards];

		try {
			var deck;

			if (existingDeck) {
				deck = await this.data.db.one(
					'UPDATE decks SET name=$1, white_cards=$2, black_cards=$3 WHERE id=$4 RETURNING *',
					[...deckData.slice(1), existingDeck.id]
				);

				res.status(201);
			} else {
				deck = await this.data.db.one(
					'INSERT INTO decks (cardcast_id, name, white_cards, black_cards) VALUES ($1, $2, $3, $4) RETURNING *',
					deckData
				);

				res.status(200);
			}
		} catch (error) {
			throw this.error(500, 'Error updating database.');
		}

		res.send({ deck });
	}
}

module.exports = Decks;
