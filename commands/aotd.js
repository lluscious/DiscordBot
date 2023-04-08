const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require('discord.js')
const wait = require('node:timers/promises').setTimeout
module.exports = {
    data: new SlashCommandBuilder()
    .setName('set_aotd')
    .setDescription('set the answer of the day')
    .addStringOption(option =>
        option.setName('msg_id')
        .setDescription('The message id of the winner')
        .setRequired(true)),

    async execute(interaction) {
        const y = interaction.options.getString('msg_id');
        const h = '1091243606142111874';
        const t = interaction.client.channels.cache.get(h);
        if (!t) {
            return interaction.reply({
                content: `Unable to find aotd channel.`, ephemeral: true
            });
        }
        if (!y) {
            return interaction.reply('Invalid message ID!');
        }

        try {
            const p = await interaction.channel.messages.fetch(y);
            if (!p) {
                return interaction.reply('Could not find message!');
            }
            const u = p.content;
            const o = p.author;
            console.log(`[Log] AOTD: ${u}`);

            const aotdEmbed = new EmbedBuilder()
            .setColor('#fc6da1')
            .setTitle(`✦ Answer of the day!`)
            .setDescription(`**${u}**!`)
            .addFields({
                name: 'Answered By', value: `**${o}**`
            })
            .setFooter({
                text: `AOTD Submitter: ${interaction.user.tag}`
            })
            .setThumbnail('https://static.wikia.nocookie.net/honkaiimpact3_gamepedia_en/images/7/70/Herrscher_of_Human_-_Ego_Trial_Card_%283-Day%29.png/revision/latest/scale-to-width-down/192?cb=20220916124241')
            .setTimestamp();

            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                console.log(`[Command_Handling] ${t.tag} denied to use command: /set_aotd`)
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
                        embeds: [aotdEmbed]
                    });
                    interaction.followUp({
                        content: `Success!`, ephemeral: true
                    });
                } catch (error) {
                    console.error(error);
                    interaction.followUp({
                        content: `I was unable to send a message. Please try again later.`, ephemeral: true
                    });
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'An error occurred while executing the command.', ephemeral: true
            });
        }
    }
}