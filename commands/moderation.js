const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const internal = require("stream");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("Moderation related command-group")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("Ban a member")
        .addUserOption((option) =>
          option.setName("user").setDescription("User to ban").setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("timeout")
        .setDescription("Timeout a member")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to timeout")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason").setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration in minutes")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription("Message a member")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User to message")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Your message")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("hide_user")
            .setRequired(true)
            .setDescription(
              `Sets sender to the server's staff team if true, Will still show your user on logs.`
            )
            .addChoices(
              { name: "True", value: "true" },
              { name: "False", value: "false" }
            )
        )
    ),

  async execute(interaction) {
    delete require.cache[require.resolve("../utils/command_config.json")];
    const { moderation } = require("../utils/command_config.json");
    if (moderation == false) {
      interaction.reply("This command is currently disabled!");
    } else {
      const sub = interaction.options.getSubcommand();

      // ---------------------------------  Subcommand : Ban  ---------------------------------  //

      if (sub === "ban") {
        const bannedUser = interaction.options.getUser("user");
        const reason =
          interaction.options.getString("reason") || "No reason provided";

        if (
          !interaction.member.permissions.has(PermissionFlagsBits.BanMembers)
        ) {
          console.log(
            `[Command_Handling] ${interaction.user.tag} denied to use command: /ban`
          );
          return interaction.reply({
            content: "You do not have permission to use this command!",
            ephemeral: true,
          });
        }

        console.log(`[Command_Handling] Banned user: ${bannedUser.tag}`);
        console.log(`[Command_Handling] Responsible: ${interaction.user.tag}`);

        const banEmbed = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Moderation : User Ban")
          .setDescription(
            `**${bannedUser.tag} has been banned from the server.**`
          )
          .addFields({ name: "Reason", value: reason })
          .setTimestamp();
        await interaction.deferReply();
        await wait(1000);
        interaction.editReply({ embeds: [banEmbed], ephemeral: false });

        const bannedEmbed = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Notice!")
          .setDescription(
            `You were banned from **${interaction.guild.name}!**.`
          )
          .addFields({ name: "Reason", value: reason })
          .setFooter({ text: `Responsible Moderator: ${interaction.user.tag}` })
          .setTimestamp();
        try {
          await bannedUser.send({ embeds: [bannedEmbed] });
          await interaction.guild.members.ban(bannedUser, { reason });
        } catch (error) {
          console.error(`[Error] ${error}`);
          const errorEmbed = new EmbedBuilder()
            .setTitle(`⚠️ Error!`)
            .setDescription(`**${error}**`)
            .setTimestamp();
          await interaction.reply({ embeds: [errorEmbed] });
        }
      }

      // ---------------------------------  Subcommand : Timeout  ---------------------------------  //
      else if (sub === "timeout") {
        const t = interaction.options.getUser("user");
        const r = interaction.options.getMember("user");
        const g =
          interaction.options.getString("reason") || "No reason provided";
        const v = interaction.options.getString("duration");
        const wait = require("node:timers/promises").setTimeout;
        const d = v * 60 * 1000;

        if (
          !interaction.member.permissions.has(
            PermissionFlagsBits.ModerateMembers
          )
        ) {
          console.log(
            `[Command_Handling] ${interaction.user.tag} denied to use command: /timeout`
          );
          return interaction.reply({
            content: "You do not have permission to use this command!",
            ephemeral: true,
          });
        }

        await r.timeout(d, g);
        console.log(`[Command_Handling] User: ${t.tag}`);
        console.log(`[Command_Handling] Duration: ${v}m`);
        console.log(`[Command_Handling] Responsible: ${interaction.user.tag}`);

        const embedf = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Moderation : Timeout")
          .setDescription(`**${t} has been timed out for ${v} minutes**`)
          .addFields({ name: "Reason", value: g })
          .setTimestamp();

        await interaction.deferReply();
        await wait(1000);
        interaction.editReply({ embeds: [embedf], ephemeral: false });

        const gembed = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Notice!")
          .setDescription(
            `**You were timed out in ${interaction.guild.name}!**.`
          )
          .addFields({ name: "Reason", value: g })
          .setFooter({ text: `Responsible Moderator: ${interaction.user.tag}` })
          .setTimestamp();

        try {
          await r.send({ embeds: [gembed] });
        } catch (error) {
          console.error(`[Error] ${error}`);
          const errorEmbed = new EmbedBuilder()
            .setTitle(`⚠️ Error!`)
            .setDescription(`**${error}**`)
            .setTimestamp();
          await interaction.reply({ embeds: [errorEmbed] });
        }
      }

      // ---------------------------------  Subcommand : Message  ---------------------------------  //

      else if (sub === "message") {
        const u = interaction.options.getUser("user");
        const f = interaction.options.getString("message");
        const p = interaction.options.getString("hide_user");
        const t = interaction.user;

        if (
          !interaction.member.permissions.has(
            PermissionFlagsBits.ManageMessages
          )
        ) {
          console.log(`[Command_Handling] ${t.tag} denied to use command: /dm`);
          return interaction.reply({
            content: "You do not have permission to use this command!",
            ephemeral: true,
          });
        }

        const gembed = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ New Message!")
          .setDescription(
            `**You have recieved a new message from ${interaction.guild.name}!**\n\n${f}\n\n**If you have any questions or issues please open a ticket.**`
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({ text: `Sender: ${t.tag}` });

        const r = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Modlog : DM Command")
          .setDescription(
            `Sender: **${interaction.user.tag}**\n\nMessage: **${f}**\n\nSent to: **${u.tag}**`
          )
          .setTimestamp();

        delete require.cache[require.resolve("../utils/channel_config.json")];
        const { modlog } = require("../utils/channel_config.json");
        const d = modlog;
        const channel = interaction.guild.channels.resolve(d);

        if (p == true) {
          await interaction.deferReply({ ephemeral: true });
          await wait(1000);
          gembed.setFooter({ text: `Sender: ${interaction.guild.name}` });
          interaction.editReply({
            content: `Successfully sent message to ${u.tag}`,
            ephemeral: true,
          });
          await channel.send({ embeds: [r] });
          await u.send({ embeds: [gembed] });
        } else if (u.id == t.id) {
          interaction.editReply({
            content: `Why are you sending a message to yourself...?`,
            ephemeral: true,
          });
        } else {
          try {
            await interaction.deferReply({ ephemeral: true });
            await wait(1000);
            interaction.editReply({
              content: `Successfully sent message to ${u.tag}`,
              ephemeral: true,
            });
            await channel.send({ embeds: [r] });
            await u.send({ embeds: [gembed] });
          } catch (error) {
            console.error(`[Error] ${error}`);
            const errorEmbed = new EmbedBuilder()
              .setTitle(`⚠️ Error!`)
              .setDescription(`**${error}**`)
              .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed] });
          }
        }
      }
    }
  },
};
