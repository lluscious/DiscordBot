const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config_edit')
    .setDescription('Configure the bot')
		.addStringOption(option => 
            option.setName('config_id')
            .setDescription('The ID of the setting to edit, use /conf_id for ids'))
    .addStringOption(option => 
            option.setName('value')
            .setDescription('Value to edit, such as channel ids depending on what youre editing')),
  async execute(interaction) {
    const m = path.join(__dirname, '../utils/channel_config.json');
    const o = interaction.options.getString('config_id')
    const u = interaction.options.getString('value');
    const configFile = fs.readFileSync(m);
    const config = JSON.parse(configFile);

    if (o === '') {
      interaction.reply('Config ID not found.')
    } else if (o == 'c01') {
      config.conf = u;
      fs.writeFileSync(m, JSON.stringify(config, null, 2));
      const p = new EmbedBuilder()
        .setTitle('✦ Configuration Updated')
        .setDescription(`Confession Channel has been set to <#${u}>`)
        .setColor('#ffc17a');
      return interaction.reply({ embeds: [p] });
    }
    
  },
};
