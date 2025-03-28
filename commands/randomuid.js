const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random_uid")
    .setDescription("Gives you a random uid")
    .addStringOption((option) =>
      option
        .setName("server")
        .setDescription("The server to check the UID")
        .setRequired(true)
        .addChoices(
          { name: "Asia", value: "1" },
          { name: "NA", value: "2" },
          { name: "EU", value: "3" },
          { name: "TW/HK/MO", value: "4" }
        )
    ),
  async execute(interaction) {
    delete require.cache[require.resolve("../data/config/commandConfigData.json")];
    const { SlashCommandUID } = require("../data/config/commandConfigData.json");
    if (SlashCommandUID == false) {
      const errorCodes = require('../developerTools/Data/errorCodesConfigData.json')
      const disabledEmbed = new EmbedBuilder()
      .setTitle(`${errorCodes[-40].ErrorTitle} ${errorCodes[-40].ErrorPossibleCause}`)
      .setDescription(errorCodes[-40].ErrorDescription)
      .setFooter({text: `Error Code: ${errorCodes[-40].ErrorID}`})
      return interaction.reply({ embeds: [disabledEmbed] });
    } else {
      const s = interaction.options.getString("server");
      const uid = Math.floor(Math.random() * 99999999);
      if (s == 1) {
        const enka = `https://enka.network/u/8${uid}/`;
        await interaction.deferReply();
        await wait(1000);
        await interaction.editReply(`Your Random UID: **8${uid}**\n\n${enka}`);
      } else if (s == 2) {
        const enka = `https://enka.network/u/6${uid}/`;
        await interaction.deferReply();
        await wait(1000);
        await interaction.editReply(`Your Random UID: **6${uid}**\n\n${enka}`);
      } else if (s == 3) {
        const enka = `https://enka.network/u/7${uid}/`;
        await interaction.deferReply();
        await wait(1000);
        await interaction.editReply(`Your Random UID: **7${uid}**\n\n${enka}`);
      } else if (s == 4) {
        const enka = `https://enka.network/u/1${uid}/`;
        await interaction.deferReply();
        await wait(1000);
        await interaction.editReply(`Your Random UID: **1${uid}**\n\n${enka}`);
      }
    }
  },
};
