const { Events } = require('discord.js')
const client = require('../client');

client.on(Events.MessageCreate, (message) => {
  const keywords = ['hello', 'hi', 'hey', 'yo', 'heya'];

  if (message.author.bot || !message.guild) {
    return;
  }

  const content = message.content.toLowerCase();
  if (keywords.includes(content)) {
    message.reply('Hello!!');
  }
});
