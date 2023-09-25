const { Events, EmbedBuilder } = require("discord.js");
const client = require("../client");

client.on(Events.messageCreate, (message) => {
  if (!message.author.bot || message.channel.guild) {
    const author = message.author;
    const detectSil = ['/silent', '/sil', '/s']
    if (message.includes(detectSil)) {
        console.log('[MessageCreate] Silent detected. Ignored message.')
    } 
    if (author.id == '') {}
  }
});
