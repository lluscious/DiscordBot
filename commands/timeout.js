const { SlashCommandBuilder, EmbedBuilder, GuildMember, PermissionFlagsBits } = require('discord.js')
module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member for a specific time')
    .addUserOption(option =>
      option.setName('user')
      .setDescription('Select a user')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
      .setDescription('Duration of timeout in minutes')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
      .setDescription('Reason for timeout')),

  async execute(interaction) {
    const t = interaction.options.getUser('user')
    const r = interaction.options.getMember('user')
    const g = interaction.options.getString('reason') || 'No reason provided';
    const v = interaction.options.getString('duration')
    const wait = require('node:timers/promises').setTimeout
    const d = v * 60 * 1000

    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      console.log(`[Command_Handling] ${interaction.user.tag} denied to use command: /timeout`)
      return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
    }

    await r.timeout(d, g)
    console.log(`[Command_Handling] User: ${t.tag}`)
    console.log(`[Command_Handling] Duration: ${v}m`)
    console.log(`[Command_Handling] Responsible: ${interaction.user.tag}`)

    const embedf = new EmbedBuilder()
    .setColor('#ffc17a')
    .setTitle('✦ User Timeout')
    .setDescription(`**${t} has been timed out for ${v} minutes**`)
    .addFields({name: 'Reason', value: g});

    await interaction.deferReply();
    await wait(1000)
    interaction.editReply({ embeds: [embedf], ephemeral: false });

    const gembed = new EmbedBuilder()
      .setColor('#ffc17a')
      .setTitle('✦ Notice!')
      .setDescription(`**You have been timed out in ${interaction.guild.name}!**.`)
      .addFields({name: 'Reason', value: g});

    try {
      await r.send({ embeds: [gembed] });
    } catch (error) {
      console.error(`[Error] Could not send DM to user ${r.tag}.`);
    }
  },
};
