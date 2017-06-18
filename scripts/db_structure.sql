DROP DATABASE IF EXISTS crude_cards;
CREATE DATABASE crude_cards;

\c crude_cards

CREATE TABLE users (
	id serial PRIMARY KEY,
	username varchar(32) NOT NULL,
	discord_id varchar(32) UNIQUE,
	google_id varchar(32) UNIQUE,
	CHECK (discord_id IS NOT NULL OR google_id IS NOT NULL)
);

CREATE TABLE decks (
	id serial PRIMARY KEY,
	name varchar(32) NOT NULL,
	cardcast_id varchar(8) UNIQUE,
	white_cards varchar(500)[],
	black_cards varchar(500)[]
);
