const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("enka")
    .setDescription("?")
    .addStringOption((option) =>
      option
        .setName("uid")
        .setDescription("The uid of the player")
        .setRequired(true)
    ),

  async execute(interaction) {
    delete require.cache[require.resolve("../data/config/commandConfigData.json")];
    const { SlashCommandEnka } = require("../data/config/commandConfigData.json");

    if (SlashCommandEnka == false) {
      const errorCodes = require("../developerTools/Data/errorCodesConfigData.json");
      const disabledEmbed = new EmbedBuilder()
        .setTitle(`${errorCodes[-40].ErrorTitle} ${errorCodes[-40].ErrorPossibleCause}`)
        .setDescription(errorCodes[-40].ErrorDescription)
        .setFooter({ text: `Error Code: ${errorCodes[-40].ErrorID}` });
      return interaction.reply({ embeds: [disabledEmbed] });

    } else {


      const s = interaction.options.getString("uid");
      const enkaAPI = `https://enka.network/api/uid/${s}?info`;

      fetch(enkaAPI)
        .then((response) => {
          if (!response.ok) { throw new Error("Network response was not ok"); } return response.json();
        })

        .then((data) => {
          const plrinfo = data.playerInfo
          let sig = plrinfo.signature
          if (sig == undefined){
            sig = 'Signature not set!'
          }
          const playerProfileEmbed = new EmbedBuilder()
            .setTitle(`${data.playerInfo.nickname}'s Profile`)
            .setDescription(`${sig}`)
            .setColor(`#73a6ff`)
            .addFields(
              {name: "UID", value: `${data.uid}`, inline: true},
              {name: 'Adventure Rank', value: `${plrinfo.level}`, inline: true},
              {name: 'World Level', value: `${plrinfo.worldLevel}`, inline: true},
              {name: 'Achievements', value: `${plrinfo.finishAchievementNum}`, inline: true},
              {name: 'Spiral Abyss', value: `Floor ${plrinfo.towerFloorIndex} // Chamber ${plrinfo.towerLevelIndex}`, inline: true},
            )
            interaction.reply({embeds:[playerProfileEmbed] })
        })

        .catch((error) => {
          console.error("Error:", error);
        });

    }
  },
};
