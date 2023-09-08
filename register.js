const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const {BotClientAccessToken} = require('./developerTools/Data/accessTokens.json')
const {BotClientID} = require('./developerTools/Data/accessTokens.json')

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log(`\n---- Registering Commands ----\n`);

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  console.log(`[Commands] Registered ${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(BotClientAccessToken);

(async () => {
  try {
    console.log(`[Commands] Registering ${commands.length} commands...`);
    await rest.put(
      Routes.applicationCommands(BotClientID),
      { body: commands }
    );
    console.log(`[Commands] Successfully registered ${commands.length} commands\n`);
    console.log(`----------- Console ----------\n`);
  } catch (error) {
    console.error(error);
  }
})();
