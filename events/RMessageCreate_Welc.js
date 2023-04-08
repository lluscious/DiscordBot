const { Events, EmbedBuilder } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded RMessageCreate_Welc.js')

client.on(Events.MessageCreate, (message) => {
  const p = ['welcome'];

    if (message.author.bot || !message.guild) {
    return;
  }
  const content = message.content.toLowerCase();
  if (p.some(word => content.includes(word))) {
    message.react('1091647893322084423')
    try {
    } catch (error) {
      console.error(error);
    }
  }
});
