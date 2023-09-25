const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
  data: new SlashCommandBuilder().setName("about").setDescription("About me!"),
  async execute(interaction) {
    const EmbedAbout = new EmbedBuilder()
      .setTitle("✦ Neuvy")
      .setColor("#73a6ff")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1094513292019499018/1102120139924717678/Ermmwhatintheflip.png"
      )
      .setImage(
        "hhttps://api.ambr.top/assets/UI/namecard/UI_NameCardPic_Neuvillette_P.png  "
      )
      .setDescription(
        "**Neuvy best hydro**"
      );
    await interaction.deferReply();
    await wait(1000);
    return interaction.editReply({ embeds: [EmbedAbout] });
  },
};
