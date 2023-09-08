const { SlashCommandBuilder, EmbedBuilder, Embed } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
  data: new SlashCommandBuilder().setName("about").setDescription("About me!"),
  async execute(interaction) {
    const EmbedAbout = new EmbedBuilder()
      .setTitle("✦ Ayato~")
      .setColor("#73a6ff")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1094513292019499018/1102120139924717678/Ermmwhatintheflip.png"
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1029748030137700352/1102973098371854476/1a0ff9f413996ac6ec0ab1746a219f0d.jpg"
      )
      .setDescription(
        "**. . . Developed by [iLyuu#7946](https://discord.com/users/1027822182446944296)!\n\nCreated for /Kazu ♡\n\n✦ Supports Fun , Moderation And Music*!*\n\nMay have a few downtimes ★**"
      );
    await interaction.deferReply();
    await wait(1000);
    return interaction.editReply({ embeds: [EmbedAbout] });
  },
};
