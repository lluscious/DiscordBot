const { SlashCommandBuilder, EmbedBuilder, GuildMember } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("luckiness")
        .setDescription("How lucky are you?")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
		const avatarURL = user.displayAvatarURL({ format: 'png', size: 4096 });
        const luck = Math.floor(Math.random() * 102);
        const luckEmbed = new EmbedBuilder()
            .setTitle(`${user.tag}'s luckiness rate!`)
            .setColor("#ffc17a")
            .setDescription(`**${user.tag} is ${luck}% lucky**`)
            .setThumbnail(avatarURL)
    if (luck >= 80) {
        return interaction.reply({ content: "That's pretty lucky!", embeds: [luckEmbed]});
      } else if (luck >= 50 && luck <= 79) {
        return interaction.reply({ content: "You're decent!", embeds: [luckEmbed]});
      } else if (luck >= 20 && luck <= 49) {
        return interaction.reply({ content: "That's.. Great.. I guess?", embeds: [luckEmbed]});
      } else if (luck >= 0 && luck <= 19) {
        return interaction.reply({ content: "Uhm... uh..", embeds: [luckEmbed]});
      }
          
    }
}
