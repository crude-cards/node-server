const CrudeCards = require('../');
const fs = require('fs');
const config = require('../configs/server.json');

config.https.certificate = fs.readFileSync(config.https.certificate);
config.https.key = fs.readFileSync(config.https.key);

config.database = require('../configs/db.json');

const server = new CrudeCards.Server(config);

server.logger.on('message', event => console.log(event.message));

server.start();
