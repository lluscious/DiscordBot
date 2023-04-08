const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } = require('discord.js');
const client = require('../index');

const spamThreshold = 5;
const spamInterval = 2000;
const spamCooldown = 30000;
let spamCount = {};
let cooldowns = {};
let lastAlertSent = 0;

client.on(Events.MessageCreate, message => {
  if (message.author.bot) return;

  if (message.channel) {
    if (cooldowns[message.author.id]) {
      return;
    }
    if (!spamCount[message.author.id]) {
      spamCount[message.author.id] = 1;
    } else {
      spamCount[message.author.id]++;
    }
    if (spamCount[message.author.id] >= spamThreshold) {
      const now = Date.now();
      if (now - lastAlertSent < spamCooldown) {
        return;
      }
      lastAlertSent = now;

      message.channel.setRateLimitPerUser(300);
      const h = message.client.channels.cache.get('1046785175310311475')
      const embed = new EmbedBuilder()
        .setColor('#fc6da1')
        .setTitle('✦ Spam Detected!')
        .setDescription(`Occuring spam detected in <#${message.channel.id}>!\n\nChannel cooldown set to 5 minutes.`)
        .addFields({name: "Triggered By", value: message.author.tag})
        .setTimestamp();

      const buttonRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('ignore_spam')
            .setLabel('Ignore Alert')
            .setStyle(ButtonStyle.Secondary),
        );

      h.send({ embeds: [embed], components: [buttonRow] }).then((sentMessage) => {
        const buttonCollector = sentMessage.createMessageComponentCollector({
          time: 60000,
        });
        buttonCollector.on('collect', (interaction) => {
           if (interaction.customId === 'ignore_spam') {
            cooldowns[message.author.id] = true;
            interaction.update({ content: `**Alert ignored by ${interaction.user.tag}!**`, components: [] })
            message.channel.setRateLimitPerUser(0);
          }
        });
      });
    }
  }
});
