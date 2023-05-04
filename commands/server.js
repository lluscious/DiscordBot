const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Displays the servers information"),
  async execute(interaction) {
    delete require.cache[require.resolve("../utils/command_config.json")];
    const { server } = require('../utils/command_config.json')
    if (server == "false") {
      interaction.reply('This command is currently disabled!')
    } else {
    const d = interaction.guild;
    const f = d.ownerId;
    const v = `<@${f}>`;
    const h = new EmbedBuilder()
      .setColor("#73a6ff")
      .setTitle(`${d.name}'s info`)
      .addFields({ name: "Owner", value: `**${v}**` })
      .addFields({ name: "ID", value: `**${d.id}**` })
      .addFields({ name: "Member Count", value: `**${d.memberCount}**` })
      .addFields({
        name: "Creation Date",
        value: `**${d.createdAt.toDateString()}**`,
      })
      .setThumbnail(d.iconURL({ dynamic: true }));
    await interaction.reply({ embeds: [h] });
    }
  },
};
