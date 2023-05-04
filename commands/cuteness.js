const {
  SlashCommandBuilder,
  EmbedBuilder,
  GuildMember,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cuteness")
    .setDescription("How cute are you?")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user").setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const avatarURL = user.displayAvatarURL({ format: "png", size: 4096 });
    const cute = Math.floor(Math.random() * 102);
    const cuteEmbed = new EmbedBuilder()
      .setTitle(`${user.tag}'s cuteness rate!`)
      .setColor("#73a6ff")
      .setDescription(`**${user.tag} is ${cute}% cute!**`)
      .setThumbnail(avatarURL);
    return interaction.reply({ embeds: [cuteEmbed] });
  },
};
