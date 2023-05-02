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
            .setImage('https://static.wikia.nocookie.net/gensin-impact/images/4/46/Namecard_Banner_Nilou_Lotus_Dance.png/revision/latest/scale-to-width-down/1000?cb=20221014113815')
            .setThumbnail('https://upload-os-bbs.hoyolab.com/upload/2022/08/26/0/d1113c7758d375f16ef80dd46a644c1b_4753026554324219193.png?x-oss-process=image/resize,s_1000/quality,q_80/auto-orient,0/interlace,1/format,png')
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
        await interaction.deferReply();
        await wait(1000)
        return interaction.editReply({ embeds: [HelpEmbed] })
    }
}
