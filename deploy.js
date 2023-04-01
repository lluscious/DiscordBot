const { REST, Routes } = require('discord.js');
const clientId = '1086118505033764885';
const { token } = require('./token.json')
const fs = require('node:fs');
const path = require('node:path');
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(`---- Registering Commands ----\n`)

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log(`[Commands] Loading ${commands.length} commands...`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`[Commands] Loaded ${data.length} commands\n`);
		console.log(`----------- Login. -----------\n`)
	} catch (error) {

		console.error(error);
	}
})();
