const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout
module.exports = {
  data: new SlashCommandBuilder()
    .setName('confess')
    .setDescription('Confess to something anonymously')
    .addStringOption(option =>
      option.setName('confession')
      .setDescription('Your confession')
      .setRequired(true)),

      async execute(interaction) {
        const y = interaction.options.getString('confession');
        const h = '1088312366128709653';
        const t = interaction.client.channels.cache.get(h);
        if (!t) {
          return interaction.reply({ content: `Unable to find confession channel.`, ephemeral: true });
        }
      
        const l = require('../../utils/emotes.json').HoD;
        const i = Math.floor(Math.random() * l.length);
        const v = l[i][i+1];
      
        const confessEmbed = new EmbedBuilder()
          .setColor('#fc6da1')
          .setTitle(`✦ Someone's Confession`)
          .setDescription(`${y}`)
          .setTimestamp()
          .setThumbnail(v);
      
        try {
          await interaction.deferReply({ephemeral: true});
          await wait(3000);
          await t.send({ embeds: [confessEmbed] });
          interaction.followUp({ content: `Your confession has been sent!`, ephemeral: true });
        } catch (error) {
          console.error(error);
          interaction.followUp({ content: `I was unable to send a confession. Please try again later.`, ephemeral: true });
        }
      }
    }      