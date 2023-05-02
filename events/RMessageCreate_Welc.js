const { Events, EmbedBuilder } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded RMessageCreate_Welc.js\n')

client.on(Events.MessageCreate, (message) => {
  const p = ['welcome', 'welc'];

    if (message.author.bot || !message.guild) {
    return;
  }
  const content = message.content.toLowerCase();
  if (p.some(word => content.includes(word))) {
    message.react('1102979213532860507')
    try {
    } catch (error) {
      console.error(error);
    }
  }
});
