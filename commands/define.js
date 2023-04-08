const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { setTimeout } = require('node:timers/promises');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription('Find a definition of a word')
    .addStringOption(option =>
      option.setName('word')
          .setDescription('Word to define')
          .setRequired(true)),
          async execute(interaction) {
            const i = interaction.options.getString('word');
            try {
              const g = `https://api.urbandictionary.com/v0/define?term=${i}`;
              const r = await axios.get(g);
              const t = r.data;
              if (t.list.length === 0) {
                await interaction.deferReply();
                await setTimeout(1000);
                await interaction.editReply(`Unable to find definition for **${i}**`);
                return;
              }
              const f = t.list[Math.floor(Math.random() * t.list.length)];
              const p = f.thumbs_up.toString();
              const y = f.thumbs_down.toString();      
              const s = f.definition.replace(/\[(\w+)\]/g,'$1');
              const m = new EmbedBuilder()
                .setColor('#fc6da1')
                .setTitle(`♡ Urban Dictionary : **${i}**`)
                .setURL(`https://www.urbandictionary.com/define.php?term=${encodeURIComponent(i)}`)
                .setThumbnail('https://upload-os-bbs.hoyolab.com/upload/2022/08/24/0a76d89daea57138c667ee18de9d7038_8379671153548271334.png')
                .setFooter({text: '- Your very smart teacher: Elysia'})
                .addFields({name: '⬆️', value: p, inline: true})
                .addFields({name: '⬇️', value: y, inline: true})
                .setDescription(s)
                .setTimestamp();
              await interaction.deferReply();
              await setTimeout(1000);
              await interaction.editReply({ embeds: [m] });
          
            } catch (error) {
              console.error(error);
              await interaction.deferReply();
              await setTimeout(1000);
              await interaction.editReply('There was an error getting the definition.');
            }
          
          }
          
};
