const { Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded messageAdd_kaz.js\n')

client.on(Events.MessageCreate, (message) => {
    const p = ['kazuya', 'kazu', 'zooted', 'kaz']

    if (message.author.bot || !message.guild) {
      return;
    }

    if (p.some(word => message.content.toLowerCase().includes(word))) {
      message.reply('STAN THE KAZUYA :100:');
    }
  });
  