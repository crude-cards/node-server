<div align="center">
  <p>
    <a href="https://crudecards.xyz"><img src="https://crudecards.xyz/assets/logo.svg" width="256" alt="Crud Cards" /></a>
  </p>
	<p>
		<a href="https://discord.gg/ZpXwXKJ"><img src="https://discordapp.com/api/guilds/320327291634974720/embed.png" alt="Discord server" /></a>
	<a href="https://travis-ci.org/crude-cards/node-server"><img src="https://travis-ci.org/crude-cards/node-server.svg?branch=master" alt="Build status" /></a>
	</p>
</div>

## About
The official node.js server for [Crude Cards.](https://crudecards.xyz/)

## Set up
### Requirements
1) PostgreSQL, make sure you can run `psql`.
2) Node.js v8.

### Commands
```bash
# Clone the repo
git clone https://github.com/crude-cards/node-server.git
cd node-server

# Install dependencies
npm install

# Fill in config (username, password, host, and port)
nano configs/db.json

# Set up!
npm run create

# Start server
npm run start
```

## License
> Copyright 2017 Amish Shah
> 
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.