const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Displays all available commands!"),
    async execute(interaction) {
        const HelpEmbed = new EmbedBuilder()
            .setTitle("✦ My Commands")
            .setColor("#73a6ff")
            .setImage('https://static.wikia.nocookie.net/gensin-impact/images/d/dc/Namecard_Banner_Kamisato_Ayato_Ripple.png/revision/latest/scale-to-width-down/1000?cb=20220330025030')
            .setThumbnail('https://static.wikia.nocookie.net/gensin-impact/images/e/eb/PSE_Kamisato_Ayato.png/revision/latest?cb=20230111052315')
            .addFields({name: '/help', value: 'Display usable commands!', inline: true})
            .addFields({name: '/user', value: 'View a users information', inline: true})
            .addFields({name: '/server', value: 'View this servers information', inline: true})
            .addFields({name: '/cuteness', value: 'Your cuteness rate!', inline: true})
            .addFields({name: '/random_color', value: 'Generates a random color with a picture', inline: true})
            .addFields({name: '/random_game', value: 'Give you a random roblox game', inline: true})
            .addFields({name: '/random_uid', value: 'Give you a random uid and its enka link', inline: true})
            .addFields({name: '/random_user', value: 'Give you a random roblox user', inline: true})
            .addFields({name: '/confess', value: 'Confess to something without anyone knowing its you.', inline: true})
            .addFields({name: '/luck', value: 'Measure your luck!', inline: true})
            .addFields({name: '/usage', value: 'Show bot usage.', inline: true})
            .setFooter({text: '★ Displaying commands usable by all members only'})
        await interaction.deferReply();
        await wait(1000)
        return interaction.editReply({ embeds: [HelpEmbed] })
    }
}
