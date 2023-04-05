const { Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded MessageCreate_hi.js')

client.on(Events.MessageCreate, (message) => {
  const keywords = ['hello', 'hi', 'hey', 'yo', 'heya'];

  if (message.author.bot || !message.guild) {
    return;
  }

  const content = message.content.toLowerCase();
  if (keywords.includes(content)) {
    message.reply('Hello!<:elysia_wave:1091633194685702144>');
  }
});
