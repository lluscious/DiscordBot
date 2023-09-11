const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const path = require('node:path')
const fs = require('node:fs')
module.exports = {
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Disable or enable some commands.")
    .addStringOption((option) =>
    option
      .setName("command")
      .setDescription("The command to disable / enable")
      .setRequired(true)
  ),
  async execute(interaction) {
    const command = interaction.options.getString('command')
    delete require.cache[require.resolve('../data/config/commandConfigData.json')]
    const commandConfigData = require('../data/config/commandConfigData.json')
    const commandConfigP = path.join(__dirname,'../data/config/commandConfigData.json');
    const commandConfigF = fs.readFileSync(commandConfigP);
    const CommandConfig = JSON.parse(commandConfigF);
    if (CommandConfig[command] == true) {
      CommandConfig[command] = false
      fs.writeFileSync(commandConfigP, JSON.stringify(CommandConfig));
      return interaction.reply({content: `done disable ${command}`})
    } else {
      CommandConfig[command] = true
      fs.writeFileSync(commandConfigP, JSON.stringify(CommandConfig));
      return interaction.reply({content: `done enable ${command}`})
    }
  },
};
