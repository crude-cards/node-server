const Route = require('../../Route');

class Meta extends Route {
	constructor(parent) {
		super('/meta', parent);
	}

	get(req, res) {
		const { options, players, games } = this.server;
		const { name, description, apiVersion, maxPlayers, maxGames } = options;

		res.json({
			name,
			description,
			api_version: apiVersion,
			players: players,
			max_players: maxPlayers,
			games,
			max_games: maxGames
		});
	}
}

module.exports = Meta;
