const childProcess = require('child_process');
const config = require('../configs/db.json');
const decks = require('cah-cards');
const pgp = require('pg-promise')();

const proc = childProcess.spawn(config.psql || 'psql',
	['-U', config.username, '-f', 'scripts/db_structure.sql'],
	{ env: { PGPASSWORD: config.password } });

console.log('Setting up database');

function out(b) {
	console.log(` - ${b.toString().trim().split('\n').join('\n - ')}`); // eslint-disable-line newline-per-chained-call
}

proc.stdout.on('data', out);
proc.stderr.on('data', out);
proc.on('close', async code => {
	if (code !== 0) {
		process.exit(code);
		return;
	}
	console.log('\nPopulating database decks');
	const db = pgp({
		host: config.host,
		port: config.port,
		database: 'crude_cards',
		user: config.username,
		password: config.password
	});
	for (const deck of Object.values(decks)) {
		try {
			const id = await db.one(
				`INSERT INTO decks (name, owner_id, white_cards, black_cards) VALUES
				($1, $2, $3::varchar(500)[], $4::varchar(500)[]) RETURNING id`,
				[deck.name, 1, deck.white, deck.black]);
			console.log(` - Added "${deck.name}" -- ID ${id.id}`);
		} catch (err) {
			console.log(err);
		}
	}
	pgp.end();
});
