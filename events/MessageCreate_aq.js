const { Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded messageAdd_aq.js')

client.on(Events.MessageCreate, (message) => {
    const p = ['lyuu', 'aq']

    if (message.author.bot || !message.guild) {
    return;
  }

  const content = message.content.toLowerCase();
  if (p.includes(content)) {
    message.reply('STAN LYUU RN!!!!!');
  }
});
