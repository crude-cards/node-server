const Route = require('../Route');

class Meta extends Route {
	constructor(server) {
		super('/api/meta', server);
	}

	get(req, res) {
		const { name, description, apiVersion, maxPlayers, maxGames } = this.server.options;

		res.json({
			name,
			description,
			api_version: apiVersion,
			players: this.server.gateway.wss.clients.length,
			max_players: maxPlayers,
			games: 0,
			max_games: maxGames
		});
	}
}

module.exports = Meta;
