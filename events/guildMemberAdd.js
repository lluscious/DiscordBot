const { EmbedBuilder, Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded guildMemberAdd.js')

client.on(Events.GuildMemberAdd, (member) => {

    // DM Embed
    const dmembed = new EmbedBuilder()
	.setTitle('❀ Welcome to Kazu*!*')
	.setDescription(`**﹒Hello My name is Ruu and I am the mascot of Kazu!!, Let me show you around our server!\n\n﹒First, reading rules are important! Go read them at <#1094883246094958683>!\n﹒After you've read the rules, You can go verify at <#1094884803448422440>!!\n﹒You can also grab yourself some roles at <#1094892823251271681>!!\n﹒Oh and after you verify, Go introduce yourself in <#1094893196955365416>!!**`)
	.setFooter({text: '♡ We are so excited to meet you!!'})
	.setImage('https://media.discordapp.net/attachments/1094488863533170878/1094933302030389328/317b5d8ccbc3bd218e2a66e92968c6ea.jpg')
	.setColor('#ffc17a')
	.setTimestamp();

    // Arrvial Embed
    const AEmbed = new EmbedBuilder()
    .setAuthor({name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
	.setTitle('. . . ♡ Welcome to Kazu*!*')
	.setDescription(`・Read our rules at <#1094883246094958683>*!*\nVerify at <#1094884803448422440>\n・Get roles at <#1094892823251271681>. . .`)
	.setFooter({text: '♡ We hope you have a wonderful time!'})
	.setImage('https://media.discordapp.net/attachments/1094488863533170878/1094933302370115646/45697bedb57c0b05bfa5230650161f8b.jpg')
    .setColor("#ffc17a")
	.setTimestamp();

    const BEmbed = new EmbedBuilder()
    .setAuthor({name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
	.setTitle('. . . ♡ A New Arrival*!*')
	.setDescription(`**Everyone, Welcome <@${member.user.id}>!!**`)
    .setThumbnail(member.avatarURL({ format: 'png', size: 4096 }))
	.setImage('https://media.discordapp.net/attachments/1094488863533170878/1094933302701477918/f3b70211a14649d3ff84bbc4a778270a.jpg')
    .setColor("#ffc17a")
	.setTimestamp();

    // Chat
    const p = '1094895389607464971';
    const i = client.channels.cache.get(p);
    
    // Arrival
    const j = '1094887374133145600';
    const m = client.channels.cache.get(j)
    
    // Send
    m.send({content: `<@${member.user.id}>`, embeds: [AEmbed]})
    i.send({content: `<@&1094950527214833795>`, embeds: [BEmbed]})
    member.send({ embeds: [dmembed] })
	.then(() => console.log(`[Event_Handler] Successfully sent welcome message to ${member.user.tag}`))
	.catch(error => console.error(`[Event_Handler] Unable to send welcome message to ${member.user.tag}: ${error}`));
});