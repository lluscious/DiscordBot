const { Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded MessageCreate_a.js')

client.on(Events.MessageCreate, (message) => {
    const p = ['a!', 'hailey', 'lezra']

        if (message.author.bot || !message.guild) {
    return;
  }

  const content = message.content.toLowerCase();
  if (p.includes(content)) {
      message.reply('STAN A!');
    }
  });
  