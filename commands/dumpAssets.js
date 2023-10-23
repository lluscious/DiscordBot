const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ambr")
    .setDescription("Find assets from ambr using their codename.")
    .addStringOption((option) =>
      option
        .setName("codename")
        .setDescription("The codename of the asset, It is usually spelled close to the asset, Or is an ID.")
        .setRequired(true)
    ),

  async execute(interaction) {
    delete require.cache[require.resolve("../data/config/commandConfigData.json")];
    const { SlashCommandDump } = require("../data/config/commandConfigData.json");

    if (SlashCommandDump == false) {
      const errorCodes = require("../developerTools/Data/errorCodesConfigData.json");
      const disabledEmbed = new EmbedBuilder()
        .setTitle(`${errorCodes[-40].ErrorTitle} ${errorCodes[-40].ErrorPossibleCause}`)
        .setDescription(errorCodes[-40].ErrorDescription)
        .setFooter({ text: `Error Code: ${errorCodes[-40].ErrorID}` });
      return interaction.reply({ embeds: [disabledEmbed] });

    } else {

        const codename = interaction.options.getString('codename')
        interaction.reply('Fetching...')
        interaction.channel.send(
            ` # ${codename}'s Assets

            ## Const
            https://api.ambr.top/assets/UI/UI_Talent_S_${codename}_01.png
            https://api.ambr.top/assets/UI/UI_Talent_S_${codename}_02.png
            https://api.ambr.top/assets/UI/UI_Talent_S_${codename}_03.png
            https://api.ambr.top/assets/UI/UI_Talent_S_${codename}_04.png
            https://api.ambr.top/assets/UI/UI_Talent_S_${codename}_05.png
            https://api.ambr.top/assets/UI/UI_Talent_S_${codename}_06.png
            
            `

        )
        interaction.channel.send(
            `## Talent
            https://api.ambr.top/assets/UI/Skill_S_${codename}_01.png
            https://api.ambr.top/assets/UI/Skill_E_${codename}_01.png
            
            ## Cosmetic
            https://api.ambr.top/assets/UI/namecard/UI_NameCardPic_${codename}_P.png
            https://api.ambr.top/assets/UI/UI_Gacha_AvatarImg_${codename}.png
            https://api.ambr.top/assets/UI/UI_AvatarIcon_${codename}.png

            **If it doesnt show up then it doesn't exist!**`
        )

    }
  },
};
