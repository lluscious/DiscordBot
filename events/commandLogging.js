const { Events, EmbedBuilder } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded commandLogging.js')

client.on(Events.InteractionCreate, (interaction) => {
    const command = interaction.commandName;
    console.log(`[Command_Handler] ${interaction.user.tag} used command: /${command}`);
});
