const request = require('snekfetch');
const querystring = require('query-string');

class Discord {
	constructor(config) {
		this.config = config;
	}

	token(code) {
		return request
			.post('https://discordapp.com/api/oauth2/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('Accept-Type', 'application/json')
			.send(querystring.stringify({
				grant_type: 'authorization_code',
				client_id: this.config.client_id,
				client_secret: this.config.client_secret,
				code,
				redirect_uri: `https://crudecards.xyz/verify.html`
			}))
			.then(res => res.body);
	}

	details(token) {
		return request
			.get('https://discordapp.com/api/users/@me')
			.set('Authorization', `Bearer ${token}`)
			.then(res => res.body);
	}
}

module.exports = Discord;
