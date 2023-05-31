const { Events, EmbedBuilder } = require("discord.js");
const client = require("../client");

client.on(Events.InteractionCreate, (interaction) => {
  if (interaction.isCommand) {
    const command = interaction.commandName;
    console.log(`[Command_Handler] ${interaction.user.tag} used command: /${command}`);
  } else {
    const interactor = interaction.customId
    console.log(`[Interaction_Handler] ${interactor} has been used by ${interaction.user.tag}`)
  }
});
