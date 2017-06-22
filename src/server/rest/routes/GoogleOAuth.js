const request = require('snekfetch');
const querystring = require('query-string');

class Google {
	constructor(server) {
		this.server = server;
	}

	async getUserID(code) {
		const data = await request
			.post('https://www.googleapis.com/oauth2/v4/token')
			.set('Content-Type', 'application/x-www-form-urlencoded')
			.set('Accept-Type', 'application/json')
			.send(querystring.stringify({
				grant_type: 'authorization_code',
				client_id: this.server.options.google.client_id,
				client_secret: this.server.options.google.client_secret,
				code,
				redirect_uri: `https://${this.server.options.development ? 'localhost' : 'crudecards.xyz'}/static/verify.html`
			}))
			.then(res => res.body);
		return JSON.parse(Buffer.from(data.id_token.split('.')[1], 'base64')).sub;
	}
}

module.exports = Google;
