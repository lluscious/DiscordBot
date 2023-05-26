const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  Events,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = require("../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Profile related commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("Configure bot properties")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to view!")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set_description")
        .setDescription("Set your description")
        .addStringOption((option) =>
          option
            .setName("new_description")
            .setDescription("The new description to set")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("register")
        .setDescription("Register your profile for the bot")
    ),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    // ---------------------------------  Subcommand : View  ---------------------------------  //

    if (sub === "view") {
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
      const bannerURL = profileData[`${user}_bannerURL`];

      if (!(user in usernameData)) {
        interaction.reply(
          "User isn't registered, Please register using the /register command!"
        );
      } else {
        const profile = new EmbedBuilder()
          .setTitle(`✦ ${username}'s Profile`)
          .addFields({ name: "Balance", value: balance.toString() })
          .addFields({ name: "Discord Username", value: interaction.user.tag })
          .addFields({ name: "Join Date", value: l.createdAt.toUTCString() })
          .setFooter({ text: "♡ Customize your profile through the shop!" })
          .setColor(color)
          .setDescription(desc)
          .setTimestamp()
          .setThumbnail(avatarURL);

        if (!(bannerURL == "None")) {
          profile.setImage(bannerURL);
        }

        if (user == interaction.user.id) {
          profile.setTitle(`✦ Your Profile (${username})`);
          interaction.reply({ embeds: [profile] });
        } else {
          interaction.reply({ embeds: [profile] });
        }
      }
    }

    // ---------------------------------  Subcommand : Set Description --------------------------------- //

    else if (sub === "set_description") {

      delete require.cache[require.resolve("../data/profile.json")];
      const file = path.join(__dirname, "../data/profile.json");

      delete require.cache[require.resolve("../data/username.json")];
      const usernameData = require("../data/username.json");
      const id = interaction.user.id;
  
      if (!(interaction.user.id in usernameData)){
        interaction.reply(`${id}_desc data not found!`)
        return;
      }

      const profile = fs.readFileSync(file);
      const profileData = JSON.parse(profile);

      const newDesc = interaction.options.getString("new_description");

      if (newDesc.length >= 40) {
        interaction.reply("Description too long, try a shorter one?");
      } else {
        const descData = `${id}_desc`;
        profileData[descData] = newDesc;
        fs.writeFileSync(file, JSON.stringify(profileData));
        interaction.reply("Description changed!");
      }
    }

    // ---------------------------------  Subcommand : Register --------------------------------- //

    else if (sub == "register") {
      delete require.cache[require.resolve("../data/username.json")];
      const usernameData = require("../data/username.json");

      if (interaction.user.id in usernameData) {
        interaction.reply("You are already registered!");
        return;
      }

      const form = new ModalBuilder()
        .setCustomId("register")
        .setTitle("User Registration");

      const username = new TextInputBuilder()
        .setCustomId("username")
        .setMinLength(3)
        .setMaxLength(20)
        .setLabel("Username")
        .setStyle(TextInputStyle.Short);

      const usernameManager = new ActionRowBuilder().addComponents(username);
      form.addComponents(usernameManager);
      interaction.showModal(form);

      let usernameInput;

      await new Promise((resolve) => {
        client.on(Events.InteractionCreate, (interaction) => {
          if (!interaction.isModalSubmit()) return;
          usernameInput = interaction.fields.getTextInputValue("username");
          console.log(`[Registration] Created ${usernameInput}`);
          interaction.reply(
            `Successfully Registered, Welcome **${usernameInput}**!`
          );
          resolve();
        });
      });

      const fs = require("fs/promises")

      const usernamePath = path.join(__dirname, "../data/username.json");
      const usernameHandler = await fs.readFile(usernamePath, "utf8");
      const userData = JSON.parse(usernameHandler);
      userData[interaction.user.id] = usernameInput;
      const userOverwriteData = JSON.stringify(userData, null, 2);
      await fs.writeFile(usernamePath, userOverwriteData);

      const balancePath = path.join(__dirname, "../data/balance.json");
      const balanceHandler = await fs.readFile(balancePath, "utf8");
      const balanceData = JSON.parse(balanceHandler);
      balanceData[interaction.user.id] = 0;
      const balanceOverwriteData = JSON.stringify(balanceData, null, 2);
      await fs.writeFile(balancePath, balanceOverwriteData);

      const profilePath = path.join(__dirname, "../data/profile.json");
      const profileHander = await fs.readFile(balancePath, "utf8");
      const profileData = JSON.parse(profileHander);
      profileData[`${interaction.user.id}_color`] = "#1c1c1c";
      profileData[`${interaction.user.id}_desc`] = "?";
      profileData[`${interaction.user.id}_bannerURL`] = "None";
      const profileOverwriteData = JSON.stringify(profileData, null, 2);
      await fs.writeFile(profilePath, profileOverwriteData);
    }
  },
};
