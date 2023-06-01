const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random_user')
    .setDescription('Gives you a random Roblox user'),
  async execute(interaction) {
    delete require.cache[require.resolve("../data/config/commandConfigData.json")];
    const { SlashCommandRobloxUser } = require('../data/config/commandConfigData.json')
    if (SlashCommandRobloxUser == false) {
      interaction.reply('This command is currently disabled!')
    } else {
    const randomId = Math.floor(Math.random() * 999999999);
    const userlink = `https://www.roblox.com/users/${randomId}/profile`;
    await interaction.deferReply();
    await wait(1000);
    await interaction.editReply(`**Random roblox user:** ${userlink}`);
    }
  },
};
