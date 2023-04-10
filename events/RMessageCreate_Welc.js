const { Events, EmbedBuilder } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded RMessageCreate_Welc.js\n')

client.on(Events.MessageCreate, (message) => {
  const p = ['welcome'];

    if (message.author.bot || !message.guild) {
    return;
  }
  const content = message.content.toLowerCase();
  if (p.some(word => content.includes(word))) {
    message.react('1094948160905953320')
    try {
    } catch (error) {
      console.error(error);
    }
  }
});
