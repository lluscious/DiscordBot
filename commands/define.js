const { SlashCommandBuilder, EmbedBuilder, makePlainError } = require("discord.js");
const axios = require("axios");
const { setTimeout } = require("node:timers/promises");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Find a definition of a word")
    .addStringOption((option) =>
      option.setName("word").setDescription("Word to define").setRequired(true)
    ),
  async execute(interaction) {
    const i = interaction.options.getString("word");
    try {
      const g = `https://api.urbandictionary.com/v0/define?term=${i}`;
      const r = await axios.get(g);
      const t = r.data;
      if (t.list.length === 0) {
        await interaction.deferReply();
        await setTimeout(1000);
        await interaction.editReply(`Unable to find definition for **${i}**`);
        return;
      }
      const f = t.list[Math.floor(Math.random() * t.list.length)];
      const p = f.thumbs_up.toString();
      const y = f.thumbs_down.toString();
      const s = f.definition.replace(/\[(\w+)\]/g, "$1");
      const m = new EmbedBuilder()
        .setColor("#73a6ff")
        .setTitle(`♡ Urban Dictionary : **${i}**`)
        .setURL(
          `https://www.urbandictionary.com/define.php?term=${encodeURIComponent(
            i
          )}`
        )
        .addFields({ name: "⬆️", value: p, inline: true })
        .addFields({ name: "⬇️", value: y, inline: true })
        .setDescription(s)
        .setTimestamp();
      await interaction.deferReply();
      await setTimeout(1000);
      await interaction.editReply({ embeds: [m] });
    } catch (error) {
      console.error(`[Error] ${error}`)
      const errorEmbed = new EmbedBuilder()
      .setTitle(`⚠️ Error!`)
      .setDescription(`**${error}**`)
      .setTimestamp()
      await interaction.reply({embeds : [errorEmbed]})
    }
  },
};
