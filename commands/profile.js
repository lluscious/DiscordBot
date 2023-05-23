const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Check someone's or your profile!")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to check").setRequired(true)
    ),
  async execute(interaction) {
    //---------------------------------------- Fetching Data ----------------------------------------\\

    const l = interaction.options.getUser("user");
    const user = l.id;
    const avatarURL = l.avatarURL({ format: "png", size: 4096 });

    delete require.cache[require.resolve("../data/balance.json")];
    delete require.cache[require.resolve("../data/profile.json")];
    delete require.cache[require.resolve("../data/username.json")];

    const usernameData = require("../data/username.json");
    const username = usernameData[user];

    const balanceData = require("../data/balance.json");
    const balance = balanceData[user];

    const profileData = require("../data/profile.json");
    const color = profileData[`${user}_color`];
    const desc = profileData[`${user}_desc`];
    const isBanned = profileData[user];
    const bannerURL = profileData[`${user}_bannerURL`];

    //---------------------------------------- Check if in data ----------------------------------------\\

    if (!(user in usernameData)) {
      interaction.reply(
        "User isn't registered, Please register using the /register command."
      );
    } else {
      const profile = new EmbedBuilder()
        .setTitle(`✦ ${username}'s Profile`)
        .addFields({ name: "Balance", value: balance.toString() })
        .addFields({ name: "Discord Username", value: l.tag })
        .addFields({ name: "Join Date", value: l.createdAt.toUTCString() })
        .addFields({ name: "Is Banned?", value: "False" })
        .setFooter({ text: "♡ Customize your profile through the shop!" })
        .setTimestamp()
        .setThumbnail(avatarURL);

      //---------------------------------------- Handle Embed According to Data ----------------------------------------\\

      if (color == "Default") {
        profile.setColor("#FFFFFF");
      } else {
        profile.setColor(color);
      }

      if (desc == "Default") {
        profile.setDescription("Hello");
      } else {
        profile.setDescription(desc);
      }

      if (bannerURL == "None") {
        
      } else {
        profile.setImage(bannerURL);
      }

      if (isBanned == 1) {
        profile.setFields({ name: "Is Banned?", value: "True" });
      } else {
        return;
      }
    }

    //---------------------------------------- Reply ----------------------------------------\\

    if (user == interaction.user.id) {
      profile.setTitle(`✦ Your Profile (${username})`);
      interaction.deferReply();
      wait(1000);
      interaction.editReply({ embeds: [profile] });
    } else {
      interaction.deferReply();
      wait(1000);
      interaction.editReply({ embeds: [profile] });
    }
  },
};
