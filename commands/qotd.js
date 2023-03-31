const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js')
const wait = require('node:timers/promises').setTimeout
module.exports = {
    data: new SlashCommandBuilder()
    .setName('qotd')
    .setDescription(`Make a qotd`)
    .addStringOption(option =>
        option.setName('question')
        .setDescription('Your question for the qotd')
        .setRequired(true)),

    async execute(interaction) {
        const y = interaction.options.getString('question');
        const h = '1091243315418116146';
        const t = interaction.client.channels.cache.get(h);
        if (!t) {
            return interaction.reply({
                content: `Unable to find qotd channel.`, ephemeral: true
            });
        }



        const l = require('../utils/emotes.json').Sayu;
        const i = Math.floor(Math.random() * l.length);
        const v = l[i][i+1];

        console.log(`[Log] ${interaction.user.tag} used command: /qotd`);
        console.log(`[Log] Question: ${y}`);

        const qotdEmbed = new EmbedBuilder()
        .setColor('#fc6da1')
        .setTitle(`✦ New QOTD!`)
        .setDescription(`${y}`)
        .setFooter({text:`Submitted by ${interaction.user.tag}!`})
        .setTimestamp()
        .setThumbnail('https://static.wikia.nocookie.net/honkaiimpact3_gamepedia_en/images/5/53/Herrscher_of_Human_-_Ego_Fragment.png/revision/latest?cb=20220915175012');

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            console.log(`[Log] ${t.tag} denied to use command: /qotd`)
            return interaction.reply({
                content: 'You do not have permission to use this command.', ephemeral: true
            });
        } else {

            try {
                await interaction.deferReply({
                    ephemeral: true
                });
                await wait(3000);
                await t.send({
                    content: '<@&1091237135501230140>', embeds: [qotdEmbed]
                });
                interaction.followUp({
                    content: `Your question has been sent!`, ephemeral: true
                });
            } catch (error) {
                console.error(error);
                interaction.followUp({
                    content: `I was unable to send a qotd. Please try again later.`, ephemeral: true
                });
            }
        }
    }
}