const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random_game")
    .setDescription("Gives you a random Roblox game"),
  async execute(interaction) {
    delete require.cache[require.resolve("../data/config/commandConfigData.json")];
    const { SlashCommandRobloxGame } = require("../data/config/commandConfigData.json");
    if (SlashCommandRobloxGame == false) {
      interaction.reply("This command is currently disabled!");
    } else {
      const randomId = Math.floor(Math.random() * 999999999);
      const gameLink = `https://www.roblox.com/games/${randomId}`;
      await interaction.deferReply();
      await wait(1000);
      await interaction.editReply(`**Random roblox game:** ${gameLink}`);
    }
  },
};
