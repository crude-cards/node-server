const Route = require('./Route');
const Discord = require('../../../utils/DiscordOAuth');
const Constants = require('../../../constants');

class MetaRoute extends Route {
	constructor(rest) {
		super(rest, '/api/meta');
		this.discord = new Discord(this.cc_server);
	}

	get(req, res) {
		res.json({
			name: this.cc_server.options.name,
			description: this.cc_server.options.description.substring(0, 512),
			api_version: Constants.api_version,
			players: this.cc_server.gateway.wss.clients.length,
			max_players: this.cc_server.options.max_players,
			games: 0,
			max_games: this.cc_server.options.max_games
		});
	}
}

module.exports = MetaRoute;
