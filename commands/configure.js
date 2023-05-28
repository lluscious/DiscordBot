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
          option
            .setName("id")
            .setDescription("The configuration ID")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("Value to change")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("ids").setDescription("List of configuration IDs")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("Disable commands")
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("The commands name to disable")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("enable")
        .setDescription("Enable disabled commands")
        .addStringOption((option) =>
          option
            .setName("command")
            .setDescription("The commands name to enable")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    delete require.cache[require.resolve("../utils/bot_managers.json")];
    const { managers } = require("../utils/bot_managers.json");
    if (!managers.includes(interaction.user.id)) {
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

    // ---------------------------------  Subcommand : Disable  ---------------------------------  //

    if (sub === "disable") {
      const why = interaction.options.getString("command");
      const huh = path.join(__dirname, "../utils/command_config.json");
      const configFile = fs.readFileSync(huh);
      const config = JSON.parse(configFile);
      if (!(why in config)) {
        interaction.reply(`Invalid command name: **${why}**`);
        return;
      }
      const hi = new EmbedBuilder()
        .setTitle("✦ Configuration : Disabling Commands")
        .setDescription(`Successfully disabled **/${why}**!`)
        .setTimestamp();
      if (config[why] == false) {
        interaction.reply(`**${why}** is already disabled!`);
      } else {
        config[why] = false;
        fs.writeFileSync(huh, JSON.stringify(config));
        console.log(`[Command_Handling] Disabled /${why}`);
        interaction.reply({ embeds: [hi] });
      }
    }


    // ---------------------------------  Subcommand : Enable  ---------------------------------  //

    if (sub === "enable") {
      const why = interaction.options.getString("command");
      const huh = path.join(__dirname, "../utils/command_config.json");
      const configFile = fs.readFileSync(huh);
      const config = JSON.parse(configFile);
      if (!(why in config)) {
        interaction.reply(`Invalid command name: **${why}**`);
        return;
      }
      const hi = new EmbedBuilder()
        .setTitle("✦ Configuration : Enabling Commands")
        .setDescription(`Successfully enabled **/${why}**!`)
        .setTimestamp();

      if (config[why] == true) {
        interaction.reply(`**${why}** is already enabled!`);
      } else {
        config[why] = true;
        fs.writeFileSync(huh, JSON.stringify(config));
        console.log(`[Command_Handling] Enabled /${why}`);
        interaction.reply({ embeds: [hi] });
      }
    }

    // ---------------------------------  Subcommand : IDs  ---------------------------------  //

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

    // ---------------------------------  Subcommand : Properties  ---------------------------------  //
    else if (sub === "properties") {
      const m = path.join(__dirname, "../utils/channel_config.json");
      const o = interaction.options.getString("id");
      const u = interaction.options.getString("value");
      const configFile = fs.readFileSync(m);
      const config = JSON.parse(configFile);
      const p = new EmbedBuilder()
        .setTitle("✦ Configuration : Update")
        .setDescription(`Successfully changed **${o}**'s value to ${u}`)
        .setTimestamp();
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
