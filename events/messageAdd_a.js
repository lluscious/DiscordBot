const { Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded messageAdd_a.js')

client.on(Events.MessageCreate, (message) => {
    const p = ['a!', 'hailey', 'lezra']

    if (message.author.bot || !message.guild) {
      return;
    }

    if (p.some(word => message.content.toLowerCase().includes(word))) {
      message.reply('STAN A!');
    }
  });
  