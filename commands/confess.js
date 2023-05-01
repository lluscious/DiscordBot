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
        delete require.cache[require.resolve('../utils/channel_config.json')];
        const { conf } = require('../utils/channel_config.json');
        const y = interaction.options.getString('confession');
        const h = conf;
        const t = interaction.client.channels.cache.get(h);
        if (!t) {
          return interaction.reply({ content: `Unable to find confession channel!`, ephemeral: true });
        }
      
        const confessEmbed = new EmbedBuilder()
          .setColor('#ffc17a')
          .setTitle(`✦ Someone's Confession. . .`)
          .setDescription(`${y}`)
          .setTimestamp()
          .setThumbnail("https://cdn.discordapp.com/attachments/1094488863533170878/1095003868531798116/Untitled18_20230410214316.png");
      
        try {
          await interaction.deferReply({ephemeral: true});
          await wait(3000);
          await t.send({ embeds: [confessEmbed] });
          interaction.followUp({ content: `Your confession has been sent!`, ephemeral: true });
        } catch (error) {
          console.error(error);
          interaction.followUp({ content: `An error occured while executing this command.`, ephemeral: true });
        }
      }
    }      