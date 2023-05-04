const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Configure the bot")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("properties")
        .setDescription("Configure bot properties")
        .addStringOption((option) =>
          option.setName("id").setDescription("The configuration ID")
        )
        .addStringOption((option) =>
          option.setName("value").setDescription("Value to change")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("ids").setDescription("List of configuration IDs")
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      console.log(
        `[Command_Handling] ${interaction.user.tag} denied to use command: /configure`
      );
      return interaction.reply({
        content: "You do not have permission to use this command!",
        ephemeral: true,
      });
    }
    delete require.cache[require.resolve("../utils/channel_config.json")];
    const { conf, modlog } = require("../utils/channel_config.json");
    const sub = interaction.options.getSubcommand();

    // ---------------------------------  IDs  ---------------------------------  //

    if (sub === "ids") {
      const id = new EmbedBuilder()
        .setTitle("✦ Configuration : Config IDs")
        .setColor("#73a6ff")
        .addFields(
          {
            name: "c01",
            value: `Confession_Send // Set To : **${conf}**`,
            inline: false,
          },
          {
            name: "m01",
            value: `Moderator_Log // Set To : **${modlog}**`,
            inline: false,
          }
        );
      await interaction.reply({ embeds: [id] });
    }

    // ---------------------------------  Properties  ---------------------------------  //
    else if (sub === "properties") {
      const m = path.join(__dirname, "../utils/channel_config.json");
      const o = interaction.options.getString("id");
      const u = interaction.options.getString("value");
      const configFile = fs.readFileSync(m);
      const config = JSON.parse(configFile);
      const p = new EmbedBuilder()
        .setTitle("✦ Configuration : Update")
        .setDescription(`Successfully changed **${o}**'s value to ${u}`)
        .setTimestamp()
        .setColor("#73a6ff");
      if (!o) {
        await interaction.reply("Config ID not found.");
      } else if (o === "c01") {
        config.conf = u;
        fs.writeFileSync(m, JSON.stringify(config, null, 2));
        await interaction.reply({ embeds: [p] });
      } else if (o === "m01") {
        config.modlog = u;
        fs.writeFileSync(m, JSON.stringify(config));
        await interaction.reply({ embeds: [p] });
      }
    }
  },
};
