const request = require('snekfetch');
const querystring = require('query-string');

exports.token = (config, code) => {
	return request
		.post('https://discordapp.com/api/oauth2/token')
		.set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Accept-Type', 'application/json')
		.send(querystring.stringify({
			grant_type: 'authorization_code',
			client_id: config.client_id,
			client_secret: config.client_secret,
			code,
			redirect_uri: 'https://localhost/callback'
		}))
		.then(res => res.body);
};

exports.details = token => {
	return request
		.get('https://discordapp.com/api/users/@me')
    .set('Authorization', `Bearer ${token}`)
		.then(res => res.body);
};
