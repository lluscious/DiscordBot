const { SlashCommandBuilder, EmbedBuilder, GuildMember, Permissions, PermissionFlagsBits } = require('discord.js')
const wait = require('node:timers/promises').setTimeout

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(option =>
      option.setName('user')
      .setDescription('Select a user')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
      .setDescription('The reason for banning')),

  async execute(interaction) {
    const bannedUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      console.log(`[Command_Handling] ${interaction.user.tag} denied to use command: /ban`)
      return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
    }

    console.log(`[Command_Handling] Banned user: ${bannedUser.tag}`)
    console.log(`[Command_Handling] Responsible: ${interaction.user.tag}`)

    const banEmbed = new EmbedBuilder()
      .setColor('#fc6da1')
      .setTitle('✦ User Banned')
      .setDescription(`**${bannedUser.tag} has been banned from the server.**`)
      .addFields({name: 'Reason', value: reason});
    await interaction.deferReply();
    await wait(1000)
    interaction.editReply({ embeds: [banEmbed], ephemeral: false });

    const bannedEmbed = new EmbedBuilder()
      .setColor('#fc6da1')
      .setTitle('✦ Banned!')
      .setDescription(`You have been banned from **${interaction.guild.name}!**.`)
      .addFields({name: 'Reason', value: reason});
    try {
      await bannedUser.send({ embeds: [bannedEmbed] });
      await interaction.guild.members.ban(bannedUser, { reason });
    } catch (error) {
      console.error(`[Error] Could not send DM to banned user ${bannedUser.tag}.`);
    }
  },
};
