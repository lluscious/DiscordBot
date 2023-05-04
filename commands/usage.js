const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usage")
    .setDescription("Show process usage"),
  async execute(interaction) {
    const uptime = process.uptime();
    const { days, hours, minutes, secondsLeft } = formatUptime(uptime);

    function formatUptime(seconds) {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secondsLeft = Math.floor(seconds % 60);

      return { days, hours, minutes, secondsLeft };
    }

    const memoryUsage = Math.floor(process.memoryUsage().rss / 1024 / 1024);
    const up = `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
    const HelpEmbed = new EmbedBuilder()
      .setTitle("♡ My Usage. . .")
      .setColor("#73a6ff")
      .setThumbnail(
        "https://static.wikia.nocookie.net/gensin-impact/images/b/b8/Lotos_Somno_Shape.png/revision/latest?cb=20221014130219"
      )
      .addFields({
        name: "Memory Usage",
        value: `${memoryUsage} MB`,
        inline: false,
      })
      .addFields({
        name: "Uptime",
        value: up,
        inline: false,
      });
    return interaction.reply({ embeds: [HelpEmbed] });
  },
};
