const { EmbedBuilder, Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded guildMemberBoost.js')

client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
    const i = client.channels.cache.get('1092887356387889152');
    
        // Boosted Embed
        const bembed = new EmbedBuilder()
        .setTitle('<:boost_akuma:1094948495389098044> . . . New Booster*!*')
        .setDescription(`**﹒Thank you <#${newMember.user.id}> for boosting us<:Exclamation_4:1094947331352301639>\n\n<:o_butterfly:1094949129156833381>.  . . Open a ticket to claim your <#1094905753074159617>!!**`)
        .setFooter({text: '♡ We are glad to hear you support us!'})
        .setImage('https://media.tenor.com/8qf_wzB8qBMAAAAd/herrscher-of-human-ego-elysia.gif')
        .setThumbnail('https://cdn3.emoji.gg/emojis/5460-angelic-heart.png')
        .setColor('#ffa680')
        .setTimestamp();

    if (newMember.premiumSince && !oldMember.premiumSince) {
      i.send({content: `<@${newMember.user.id}>`, embeds: [bembed]});
    }
  });
  