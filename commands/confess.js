const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("confess")
    .setDescription("Confess to something anonymously")
    .addStringOption((option) =>
      option
        .setName("confession")
        .setDescription("Your confession")
        .setRequired(true)
    ),

  async execute(interaction) {
    delete require.cache[require.resolve("../data/config/commandConfigData.json")];
    const { SlashCommandConfession } = require("../data/config/commandConfigData.json");
    if (SlashCommandConfession == false) {
      const errorCodes = require('../developerTools/Data/errorCodesConfigData.json')
      const disabledEmbed = new EmbedBuilder()
      .setTitle(`${errorCodes[-40].ErrorTitle} ${errorCodes[-40].ErrorPossibleCause}`)
      .setDescription(errorCodes[-40].ErrorDescription)
      .setFooter({text: `Error Code: ${errorCodes[-40].ErrorID}`})
      return interaction.reply({ embeds: [disabledEmbed] });
    } else {
      delete require.cache[require.resolve("../data/config/channelConfigData.json")];
      const {BotConfessionSendChannel} = require("../data/config/channelConfigData.json");
      const Confession = interaction.options.getString("confession");
      const ChannelConfession = interaction.client.channels.cache.get(BotConfessionSendChannel);
      if (!ChannelConfession) {
        return interaction.reply({
          content: `Unable to find confession channel!`,
          ephemeral: true,
        });
      }

      const confessEmbed = new EmbedBuilder()
        .setColor("#73a6ff")
        .setTitle(`✦ Someone's Confession. . .`)
        .setDescription(`${Confession}`)
        .setTimestamp()
        .setThumbnail(
          "https://cdn.discordapp.com/attachments/1094488863533170878/1095003868531798116/Untitled18_20230410214316.png"
        );

      try {
        await interaction.deferReply({ ephemeral: true });
        await wait(3000);
        await ChannelConfession.send({ embeds: [confessEmbed] });
        interaction.followUp({
          content: `Your confession has been sent!`,
          ephemeral: true,
        });
      } catch (error) {
        console.error(`[Error] ${error}`);
      }
    }
  },
};
