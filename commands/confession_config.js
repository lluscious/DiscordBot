const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('confession_set')
    .setDescription('Configure the confession channel')
		.addStringOption(option => 
            option.setName('id')
            .setDescription('the id')),
  async execute(interaction) {
    const m = path.join(__dirname, '../utils/channel_config.json');
    const o = interaction.options.getString('id');
    const configFile = fs.readFileSync(m);
    const config = JSON.parse(configFile);
    config.conf = o;
    fs.writeFileSync(m, JSON.stringify(config, null, 2));
    const p = new EmbedBuilder()
      .setTitle('✦ Configuration Updated')
      .setDescription(`Confession Channel has been set to <#${o}>`)
      .setColor('#ffc17a');
    return interaction.reply({ embeds: [p] });
  },
};
