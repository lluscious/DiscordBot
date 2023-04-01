const { Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded messageAdd_hi.js')

client.on(Events.MessageCreate, (message) => {
    const p = ['hello', 'hi', 'hey', 'yo', 'heya']

    if (message.author.bot || !message.guild) {
      return;
    }

    if (p.some(word => message.content.toLowerCase().includes(word))) {
      message.reply('Hello!<:elysia_wave:1091633194685702144>');
    }
  });
  