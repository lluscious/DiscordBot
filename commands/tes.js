const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const errorCodes = require('../developerTools/Data/errorCodesConfigData.json');

module.exports = {
  data: new SlashCommandBuilder().setName("test").setDescription("?"),
  async execute(interaction) {
    const disabledEmbed = new EmbedBuilder()
    .setTitle(`${errorCodes[-41].ErrorTitle} ${errorCodes[-41].ErrorPossibleCause}`)
    .setDescription(errorCodes[-41].ErrorDescription)
    .setFooter({text: `Error Code: ${errorCodes[-41].ErrorID}`})
    return interaction.editReply({ embeds: [disabledEmbed] });
  },
};
