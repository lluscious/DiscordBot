const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random_color")
        .setDescription("Gives you a random color"),
    async execute(interaction) {
        delete require.cache[require.resolve("../data/config/commandConfigData.json")];
        const { SlashCommandColor } = require('../data/config/commandConfigData.json')
        if (SlashCommandColor == false) {
            const errorCodes = require('../developerTools/Data/errorCodesConfigData.json')
            const disabledEmbed = new EmbedBuilder()
            .setTitle(`${errorCodes[-40].ErrorTitle} ${errorCodes[-40].ErrorPossibleCause}`)
            .setDescription(errorCodes[-40].ErrorDescription)
            .setFooter({text: `Error Code: ${errorCodes[-40].ErrorID}`})
            return interaction.reply({ embeds: [disabledEmbed] });
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
