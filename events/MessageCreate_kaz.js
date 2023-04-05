const { Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded MessageCreate_kaz.js\n')

client.on(Events.MessageCreate, (message) => {
    const p = ['kazuya', 'kazu', 'zooted', 'kaz']

    if (message.author.bot || !message.guild) {
    return;
  }

  const content = message.content.toLowerCase();
  if (p.includes(content)) {
      message.reply('STAN THE KAZUYA :100:');
    }
  });
  