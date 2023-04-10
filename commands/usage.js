const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('usage')
    .setDescription('Show process usage'),
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
      .setColor('#ffc17a')
      .setThumbnail(
        'https://upload-os-bbs.hoyolab.com/upload/2022/08/26/0/214de44639e584e74cbf5c041512dfc7_8717517192330651995.png?x-oss-process=image/resize,s_1000/quality,q_80/auto-orient,0/interlace,1/format,png'
      )
      .addFields({
        name: 'Memory Usage',
        value: `${memoryUsage} MB`,
        inline: false,
      })
      .addFields({
        name: 'Uptime',
        value: up,
        inline: false,
      });
    return interaction.reply({ embeds: [HelpEmbed] });
  },
};
