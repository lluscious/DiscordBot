const {
  SlashCommandBuilder,
  EmbedBuilder,
  GuildMember,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("View a user's information")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  async execute(interaction) {
    delete require.cache[require.resolve("../utils/command_config.json")];
    const { user } = require('../utils/command_config.json')
    if (user == "false") {
      interaction.reply('This command is currently disabled!')
    } else {
    const user = interaction.options.getUser("user");
    const avatarURL = user.avatarURL({ format: "png", size: 4096 });
    const bannerURL = user.bannerURL({ format: "png", size: 4096 });
    const userEmbed = new EmbedBuilder()
      .setTitle("User Info")
      .setColor("#73a6ff")
      .addFields({
        name: "User",
        value: `**${user.toString()}**`,
        inline: false,
      })
      .addFields({ name: "Full User", value: `**${user.tag}**` })
      .addFields({
        name: "Join Date",
        value: `**${user.createdAt.toUTCString()}**`,
        inline: false,
      })
      .addFields({ name: "ID", value: `**${user.id}**`, inline: false })
      .setThumbnail(avatarURL)
      .setImage(bannerURL);
    return interaction.reply({ embeds: [userEmbed] });
    }
  },
};
