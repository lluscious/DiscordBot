const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('View a channels information')
        .addChannelOption(option =>
        option.setName('channel')
            .setDescription('Channel to manage')
            .setRequired(true)),
    async execute(interaction) {
        const y = interaction.options.getChannel('channel')
        const o = y.rateLimitPerUser;
        const d = interaction.guild;
        const h = new EmbedBuilder()
            .setColor('#fc6da1')
            .setTitle(`★ #${y.name}`)
            .addFields({ name: 'Channel ID', value: `**${y.id}**` })
            .addFields({ name: 'Creation Date', value: `**${y.createdAt.toDateString()}**` })
            .setThumbnail(d.iconURL({ dynamic: true }))
        if (o > 0) {
            h.addFields({ name: 'Slowmode?', value: `**${o}**` })
            await interaction.deferReply();
            await wait(1000)
            await interaction.editReply({embeds: [h]})
        } else {
            h.addFields({ name: 'Slowmode?', value: `**False**` })
            await interaction.deferReply();
            await wait(1000)
            await interaction.editReply({embeds: [h]})
        }
    },
};
