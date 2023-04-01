const { EmbedBuilder, Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded guildMemberBoost.js')

client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
    const i = client.channels.cache.get('1091651997519859832');
    
        // Boosted Embed
        const bembed = new EmbedBuilder()
        .setTitle('<:Emoji_007_PinkSnowflake:1091645986939617321> . . . New Booster*!*')
        .setDescription(`**﹒Thank you <#${newMember.user.id}> for boosting us! <:Emoji_012_PinkSparkles:1091645937836900352>\n<:pink_heart:1091647841820229705>Claim your perks by <#1047048682522030120>**`)
        .setFooter({text: '♡ We are glad to hear you support us!'})
        .setImage('https://media.tenor.com/8qf_wzB8qBMAAAAd/herrscher-of-human-ego-elysia.gif')
        .setThumbnail('https://cdn3.emoji.gg/emojis/5460-angelic-heart.png')
        .setColor('#fc6da1')
        .setTimestamp();

    if (newMember.premiumSince && !oldMember.premiumSince) {
      i.send({content: `<@${newMember.user.id}>`, embeds: [bembed]});
    }
  });
  