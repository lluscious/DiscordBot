const { EmbedBuilder, Events } = require('discord.js')
const client = require('../index');

console.log('[Event] Loaded guildMemberAdd.js')

client.on(Events.GuildMemberAdd, (member) => {

    // DM Embed
    const dmembed = new EmbedBuilder()
	.setTitle('❀ Welcome to Heavenly Realms*!*')
	.setDescription(`**﹒Hello hello!! I am HR's bot and i am so excited to meet you, Let me tell you and show you about our server!\n\n﹒First, reading rules are important! Go read them at <#1047042288011989032>!\n﹒After you've read the rules, You can go verify at <#1047074334520381510>!!\n﹒You can also grab yourself some roles and colors at <#1047048159991451678>!!\n﹒Oh and after you verify, Go introduce yourself in <#1091236356212150313>!!**`)
	.setFooter({text: '♡ We hope you have a wonderful time!'})
	.setImage('https://media.discordapp.net/attachments/1055483836764536843/1089082937863053332/Elysia_Realm_Heavenly.png?width=1080&height=360')
	.setColor('#fc6da1')
	.setTimestamp();

    // Arrvial Embed
    const AEmbed = new EmbedBuilder()
    .setAuthor({name: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true })})
	.setTitle('. . . ♡ Welcome to Heavenly Realm*!*')
	.setDescription(`・Read our rules at <#1047042288011989032>*!*\nVerify at <#1047074334520381510>\n・Get roles and colors at <#1047048159991451678>`)
	.setFooter({text: '♡ We hope you have a wonderful time!'})
	.setImage('https://media.discordapp.net/attachments/1055483836764536843/1089082937863053332/Elysia_Realm_Heavenly.png?width=1080&height=360')
    .setColor("#fc6da1")
    .setImage('https://media.tenor.com/XCP0wQKx9_wAAAAd/herrscher-of-human-ego-elysia.gif')
	.setTimestamp();

    // Chat
    const p = '1047049090887860244';
    const i = client.channels.cache.get(p);
    
    // Arrival
    const j = '1047043174188724254';
    const m = client.channels.cache.get(j)
    
    // Send
    m.send({content: `<@${member.user.id}>`, embeds: [AEmbed]})
    i.send({content: `Welcome ${member.user}!!<:elysia_wave:1091633194685702144> `})
    member.send({ embeds: [dmembed] })
	.then(() => console.log(`[Log] Successfully sent welcome message to ${member.user.tag}`))
	.catch(error => console.error(`[Log] Unable to send welcome message to ${member.user.tag}: ${error}`));
});