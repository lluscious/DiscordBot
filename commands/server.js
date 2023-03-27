const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays the servers information'),
    async execute(interaction) {
        const d = interaction.guild;
        const f = d.ownerId
        const v = `<@${f}>`
        const h = new EmbedBuilder()
            .setColor('#fc6da1')
            .setTitle(`${d.name}'s info`)
            .addFields({ name: 'Owner', value: `**${v}**` })
            .addFields({ name: 'ID', value: `**${d.id}**` })
            .addFields({ name: 'Member Count', value: `**${d.memberCount}**` })
            .addFields({ name: 'Creation Date', value: `**${d.createdAt.toDateString()}**` })
            .setThumbnail(d.iconURL({ dynamic: true }))
        console.log(`[Log] ${interaction.user.tag} used command: /server`)
        await interaction.reply({ embeds: [h] });
    },
};
