const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const errorCodes = require('../developerTools/Data/errorCodesConfigData.json');

// THIS CODE IS WRONG ON PURPOSE
module.exports = {
  data: new SlashCommandBuilder().setName("test").setDescription("?"),
  async execute(interaction) {
    const disabledEmbed = new EmbedBuilder()
    .setTitle(`${errorCodes["Namiyen"].ErrorTitle} ${errorCodes["Namiyen"].ErrorPossibleCause}`)
    .setDescription(errorCodes["Namiyen"].ErrorDescription)
    .setFooter({text: `Error Code: ${errorCodes["Namiyen"].ErrorID}`})
    return interaction.editReply({ embeds: [disabledEmbed] });
  },
};
