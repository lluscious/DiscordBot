const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random_color")
        .setDescription("Gives you a random color"),
    async execute(interaction) {
        delete require.cache[require.resolve("../utils/command_config.json")];
        const { randomcolor } = require('../utils/command_config.json')
        if (randomcolor == "false") {
          interaction.reply('This command is currently disabled!')
        } else {
        const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const img = `https://singlecolorimage.com/get/${color}/400x400`
        const colorEmbed = new EmbedBuilder()
            .setTitle("Your random color")
            .setColor(color)
            .setDescription(`Color: ${color}`)
            .setImage(img)
        return interaction.reply({ embeds: [colorEmbed] })
        }
    }
}
