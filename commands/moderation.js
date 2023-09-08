const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
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
    delete require.cache[require.resolve("../data/config/commandConfigData.json")];
    const { SlashCommandGroupModeration } = require("../data/config/commandConfigData.json");
    if (SlashCommandGroupModeration == false) {
      const errorCodes = require('../developerTools/Data/errorCodesConfigData.json')
      const disabledEmbed = new EmbedBuilder()
      .setTitle(`${errorCodes[-40].ErrorTitle} ${errorCodes[-40].ErrorPossibleCause}`)
      .setDescription(errorCodes[-40].ErrorDescription)
      .setFooter({text: `Error Code: ${errorCodes[-40].ErrorID}`})
      return interaction.reply({ embeds: [disabledEmbed] });
    } else {
      const Subcommand = interaction.options.getSubcommand();

      // ---------------------------------  Subcommand : Ban  ---------------------------------  //

      if (Subcommand === "ban") {
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
        }
      }

      // ---------------------------------  Subcommand : Timeout  ---------------------------------  //
      else if (Subcommand === "timeout") {
        const CommandTimoutGetUser = interaction.options.getUser("user");
        const CommandTimoutGetMember = interaction.options.getMember("user");
        const stringOptionReason = interaction.options.getString("reason") || "No reason provided";
        const stringOptionDuration = interaction.options.getString("duration")
        const intOptionDuration = stringOptionDuration * 60 * 1000;

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

        await CommandTimoutGetMember.timeout(intOptionDuration, stringOptionReason);
        console.log(`[Command_Handling] User: ${CommandTimoutGetUser.tag}`);
        console.log(`[Command_Handling] Duration: ${stringOptionDuration}m`);
        console.log(`[Command_Handling] Responsible: ${interaction.user.tag}`);

        const Embed_Timeout = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Moderation : Timeout")
          .setDescription(`**${CommandTimoutGetUser} has been timed out for ${stringOptionDuration} minutes**`)
          .addFields({ name: "Reason", value: stringOptionReason })
          .setTimestamp();

        await interaction.deferReply();
        await wait(1000);
        interaction.editReply({ embeds: [Embed_Timeout], ephemeral: false });

        const Embed_TimeoutUser = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Notice!")
          .setDescription(
            `**You were timed out in ${interaction.guild.name}!**.`
          )
          .addFields({ name: "Reason", value: stringOptionReason })
          .setFooter({ text: `Responsible Moderator: ${interaction.user.tag}` })
          .setTimestamp();

        try {
          await CommandTimoutGetMember.send({ embeds: [Embed_TimeoutUser] });
        } catch (error) {
          console.error(`[Error] ${error}`);
        }
      }

      // ---------------------------------  Subcommand : Message  ---------------------------------  //

      else if (Subcommand === "message") {
        const CommandMsgGetUser = interaction.options.getUser("user");
        const StringGetMsg = interaction.options.getString("message");
        const choiceHideUser = interaction.options.getString("hide_user");
        const CommandTimoutGetUser = interaction.user;

        if (
          !interaction.member.permissions.has(
            PermissionFlagsBits.ManageMessages
          )
        ) {
          console.log(`[Command_Handling] ${CommandTimoutGetUser.tag} denied to use command: /dm`);
          return interaction.reply({
            content: "You do not have permission to use this command!",
            ephemeral: true,
          });
        }

        const Embed_Message = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ New Message!")
          .setDescription(
            `**You have recieved a new message from ${interaction.guild.name}!**\n\n${StringGetMsg}\n\n**If you have any questions or issues please open a ticket.**`
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setTimestamp()
          .setFooter({ text: `Sender: ${interaction.user.tag}` });

        const Embed_LogAction = new EmbedBuilder()
          .setColor("#73a6ff")
          .setTitle("✦ Modlog : DM Command")
          .setDescription(
            `Sender: **${interaction.user.tag}**\n\nMessage: **${StringGetMsg}**\n\nSent to: **${CommandMsgGetUser.tag}**`
          )
          .setTimestamp();

        delete require.cache[require.resolve("../data/config/channelConfigData.json")];
        const { BotModeratorLoggingSendChannel } = require("../data/config/channelConfigData.json");
        const ChannelLogging = BotModeratorLoggingSendChannel;
        const ChannelLogging1 = interaction.guild.channels.resolve(ChannelLogging);

        if (choiceHideUser == true) {
          await interaction.deferReply({ ephemeral: true });
          await wait(1000);
          gembed.setFooter({ text: `Sender: ${interaction.guild.name}` });
          interaction.editReply({
            content: `Successfully sent message to ${CommandMsgGetUser.tag}`,
            ephemeral: true,
          });
          await ChannelLogging1.send({ embeds: [Embed_LogAction] });
          await CommandMsgGetUser.send({ embeds: [Embed_Message] });
        } else if (CommandMsgGetUser.id == CommandMsgGetUser.id) {
          interaction.editReply({
            content: `Why are you sending a message to yourself...?`,
            ephemeral: true,
          });
        } else {
          try {
            await interaction.deferReply({ ephemeral: true });
            await wait(1000);
            interaction.editReply({
              content: `Successfully sent message to ${CommandMsgGetUser.tag}`,
              ephemeral: true,
            });
            await ChannelLogging1.send({ embeds: [Embed_LogAction] });
            await CommandMsgGetUser.send({ embeds: [Embed_Message] });
          } catch (error) {
            console.error(`[Error] ${error}`);
          }
        }
      }
    }
  },
};
