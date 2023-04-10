const { SlashCommandBuilder, EmbedBuilder, GuildMember, PermissionFlagsBits } = require('discord.js')
const wait = require('node:timers/promises').setTimeout
module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Message a member with this bot, Your username will be shown.')
    .addUserOption(option =>
      option.setName('user')
      .setDescription('User to dm')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
      .setDescription('Your message')                             // hi mango ri foe
      .setRequired(true))
    .addStringOption(option =>
      option.setName('hide_user')
      .setDescription('Sets sender to "HR Staff Team" if true, Will still show your user on logs.')
      .addChoices(
        { name: 'True', value: 'true' },
				{ name: 'False', value: 'false' },
    )),

  async execute(interaction) {
    const u = interaction.options.getUser('user')
    const f = interaction.options.getString('message')
    const p = interaction.options.getString('hide_user')
    const t = interaction.user

    console.log(`[Command_Handling] User: ${u.tag}`)
    console.log(`[Command_Handling] Message: ${f}`)

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      console.log(`[Command_Handling] ${t.tag} denied to use command: /dm`)
      return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
    }

      const gembed = new EmbedBuilder()
        .setColor('#ffc17a')
        .setTitle('✦ New Message!')
        .setDescription(`**You have recieved a new message from ${interaction.guild.name}!**\n\n${f}\n\n**If you have any questions or issues please open a ticket.**`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `Sender: ${t.tag}`});

        if (p == 'true') {
          await interaction.deferReply({ ephemeral: true})
          await wait(1000)
          gembed.setFooter({ text: `Sender: Kazu's Staff Team!`});
          interaction.editReply({content: `Successfully sent message to ${u.tag}`, ephemeral: true})
          await u.send({ embeds: [gembed] });
        } else if (u.id == t.id) {
          interaction.editReply({content: `Why are you sending a message to yourself...?`, ephemeral: true})
        } else {
        try {
            await interaction.deferReply({ephemeral: true})
            await wait(1000)
          interaction.editReply({content: `Successfully sent message to ${u.tag}`, ephemeral: true})
          await u.send({ embeds: [gembed] });
        } catch (error) {
          interaction.reply({content: `Unable to send message to ${u.tag}`, ephemeral: true})
        }
      }
  },
};
