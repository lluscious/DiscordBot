const { REST, Routes } = require('discord.js');
const { token } = require('./token.json');
const fs = require('fs');
const path = require('path');
const clientId = '1094952046035222559'

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('\x1b[36m%s\x1b[0m', `\n---- Registering Commands ----\n`);

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  console.log(`[Commands] Registered ${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`[Commands] Registering ${commands.length} commands...`);

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log(`[Commands] Successfully registered ${commands.length} commands\n`);
    console.log("\x1b[36m%s\x1b[0m", `----------- Console ----------\n`);
  } catch (error) {
    console.error(error);
  }
})();
