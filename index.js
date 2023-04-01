// Upon Start
console.clear();
console.log(`------- Refreshing Commands -------`)

// Yay
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActionRowBuilder, ActivityType } = require('discord.js');
const { token } = require('./token.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });``


client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[Warning] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
  

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		return console.error(error);
	}

});

client.once(Events.ClientReady, c => {
	client.user.setPresence({ activities: [{ name: 'Heavenly Realms!', type: ActivityType.Watching }], status: 'dnd' });
	let index = 0
	setInterval(() => {
  		if (index === 0) {
    		client.user.setPresence({ activities: [{ name: 'aq crying', type: ActivityType.Listening }], status: 'dnd' });
    		index = 1;
  		} else {
			client.user.setPresence({ activities: [{ name: 'Heavenly Realms!' , type: ActivityType.Watching}], status: 'dnd' });
    		index = 0;
  		}
		}, 30000);
    console.log(`[Log] Successfully logged in as ${c.user.tag}`);
	console.log(`------- Console -------`)
});

require('./deploy')
client.login(token);