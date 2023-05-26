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
        .setName("edit")
        .setDescription("Edit your profile")
        .addStringOption((option) =>
          option
            .setName("object")
            .setDescription("Object to edit")
            .setRequired(true)
            .addChoices(
              { name: "Username", value: "choice_user" },
              { name: "Description", value: "choice_desc" },
              { name: "Embed color", value: "choice_color" },
              { name: "Banner URL", value: "choice_url" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("value")
            .setDescription("New value to set")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("like")
        .setDescription("Like another user's profile")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User's profile to like")
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

      delete require.cache[require.resolve("../data/likes.json")];
      delete require.cache[require.resolve("../data/profile.json")];
      delete require.cache[require.resolve("../data/username.json")];

      const usernameData = require("../data/username.json");
      const username = usernameData[user];

      const favoriteData = require("../data/likes.json");
      const likes = favoriteData[`${user}_likes`];
      const liked = favoriteData[`${user}_liked`];

      const profileData = require("../data/profile.json");
      const color = profileData[`${user}_color`];
      const desc = profileData[`${user}_desc`];
      const bannerURL = profileData[`${user}_url`];

      if (!(user in usernameData)) {
        interaction.reply(
          "User isn't registered, Please register using the /register command!"
        );
      } else {
        const profile = new EmbedBuilder()
          .setTitle(`✦ ${username}'s Profile`)
          .addFields({
            name: "Likes Recieved",
            value: `${likes.toString()}`,
          })
          .addFields({
            name: "Likes Given",
            value: `${liked.toString()}`,
          })
          .addFields({ name: "Discord Username", value: l.tag })
          .addFields({ name: "Join Date", value: l.createdAt.toUTCString() })
          .setFooter({
            text: "♡ Customize your profile by using /profile edit!",
          })
          .setColor(color)
          .setDescription(desc)
          .setTimestamp()
          .setThumbnail(avatarURL);

        if (bannerURL !== "None") {
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

    // ---------------------------------  Subcommand : Edit --------------------------------- //
    else if (sub === "edit") {
      delete require.cache[require.resolve("../data/username.json")];
      const usernameData = require("../data/username.json");
      const id = interaction.user.id;
      if (!(interaction.user.id in usernameData)) {
        interaction.reply(`${id} data not found!`);
        return;
      }

      const editor = interaction.options.getString("object");

      // User

      if (editor == "choice_user") {
        const username = interaction.options.getString("value");

        if (username.length > 16) {
          interaction.reply("Username must be under 16 or 16 characters!");
          return;
        } else {
          delete require.cache[require.resolve("../data/username.json")];
          const username_path = path.join(__dirname, "../data/username.json");
          const user = fs.readFileSync(username_path);
          const userData = JSON.parse(user);
          userData[id] = username;
          fs.writeFileSync(username_path, JSON.stringify(userData));
          interaction.reply("Username changed!");
        }
      }

      // Desc
      else if (editor == "choice_desc") {
        delete require.cache[require.resolve("../data/profile.json")];
        const profile_path = path.join(__dirname, "../data/profile.json");
        const profile = fs.readFileSync(profile_path);
        const profileData = JSON.parse(profile);
        const newDesc = interaction.options.getString("value");

        if (newDesc.length >= 40) {
          interaction.reply("Description too long, try a shorter one?");
        } else {
          const descData = `${id}_desc`;
          profileData[descData] = newDesc;
          fs.writeFileSync(profile_path, JSON.stringify(profileData));
          interaction.reply("Description changed!");
        }
      }

      // Color
      else if (editor == "choice_color") {
        delete require.cache[require.resolve("../data/profile.json")];
        const profile_path = path.join(__dirname, "../data/profile.json");
        const profile = fs.readFileSync(profile_path);
        const profileData = JSON.parse(profile);
        const newColor = interaction.options.getString("value");

        if (newColor.length !== 7) {
          interaction.reply("Invalid hex color!");
        } else {
          const colorData = `${id}_color`;
          profileData[colorData] = newColor;
          fs.writeFileSync(profile_path, JSON.stringify(profileData));
          interaction.reply("Embed color changed!");
        }
      }

      // Banner URL
      else if (editor == "choice_url") {
        delete require.cache[require.resolve("../data/profile.json")];
        const profile_path = path.join(__dirname, "../data/profile.json");
        const profile = fs.readFileSync(profile_path);
        const profileData = JSON.parse(profile);
        const newURL = interaction.options.getString("value");
        if (newURL.startsWith("http://") || newURL.startsWith("https://")) {
          const urlData = `${id}_url`;
          profileData[urlData] = newURL;
          fs.writeFileSync(profile_path, JSON.stringify(profileData));
          interaction.reply("Banner image changed!");
        } else {
          interaction.reply("Invalid link!");
        }
      }
    }

    // ---------------------------------  Subcommand : Like --------------------------------- //

    if (sub == "like") {
      const user = interaction.options.getUser("user");
      if (user.id == interaction.user.id) {
        interaction.reply({
          content: `You can't like your own profile!`,
          ephemeral: true,
        });
        return;
      }
      delete require.cache[require.resolve("../data/likes.json")];
      const LikeAmount = require("../data/likes.json");
      const likes_path = path.join(__dirname, "../data/likes.json");
      const likes = fs.readFileSync(likes_path);
      const likeData = JSON.parse(likes);
      const newLikesAmount = LikeAmount[`${user.id}_likes`] + 1;
      const newLikedAmount = LikeAmount[`${interaction.user.id}_liked`] + 1;
      likeData[`${user.id}_likes`] = newLikesAmount;
      likeData[`${interaction.user.id}_liked`] = newLikedAmount;
      fs.writeFileSync(likes_path, JSON.stringify(likeData));

      if (!user.id in LikeAmount || !interaction.user.id in LikeAmount) {
        return interaction.reply({
          content: "User not registered!",
          ephemeral: true,
        });
      }

      const likeDM = new EmbedBuilder()
        .setTitle("♡ New like recieved!")
        .setDescription(
          `${interaction.user.tag} liked your profile!\n\n♡ You now have **${newLikesAmount}** likes!`
        )
        .setThumbnail(
          "https://preview.redd.it/ayato-emotes-from-genshin-x-heytea-collab-v0-itdbi639s6m91.png?width=141&format=png&auto=webp&v=enabled&p=e&s=9ea734e2601843600584a54e4935261e3cc7f78f"
        )
        .setTimestamp()
        .setColor("#94d1ff");
      interaction.reply({
        content: `Successfully liked ${user.tag}'s profile!`,
        ephemeral: true,
      });
      user.send({embeds: [likeDM]})
    }

    // ---------------------------------  Subcommand : Register --------------------------------- //
    else if (sub == "register") {
      delete require.cache[require.resolve("../data/username.json")];
      const usernameData = require("../data/username.json");

      if (interaction.user.id in usernameData) {
        interaction.reply("You are already registered!");
        return;
      } else {
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
            resolve();
            interaction.reply(
              `Successfully Registered, Welcome **${usernameInput}**!`
            );
          });
        });

        const fs = require("fs/promises");

        const usernamePath = path.join(__dirname, "../data/username.json");
        const usernameHandler = await fs.readFile(usernamePath, "utf8");
        const userData = JSON.parse(usernameHandler);
        userData[interaction.user.id] = usernameInput;
        const userOverwriteData = JSON.stringify(userData, null, 2);
        await fs.writeFile(usernamePath, userOverwriteData);

        const balancePath = path.join(__dirname, "../data/likes.json");
        const balanceHandler = await fs.readFile(balancePath, "utf8");
        const balanceData = JSON.parse(balanceHandler);
        balanceData[`${interaction.user.id}_likes`] = 0;
        balanceData[`${interaction.user.id}_liked`] = 0;
        const balanceOverwriteData = JSON.stringify(balanceData, null, 2);
        await fs.writeFile(balancePath, balanceOverwriteData);

        const profilePath = path.join(__dirname, "../data/profile.json");
        const profileHander = await fs.readFile(profilePath, "utf8");
        const profileData = JSON.parse(profileHander);
        profileData[`${interaction.user.id}_color`] = "#1c1c1c";
        profileData[`${interaction.user.id}_desc`] = "?";
        profileData[`${interaction.user.id}_url`] = "None";
        const profileOverwriteData = JSON.stringify(profileData, null, 2);
        await fs.writeFile(profilePath, profileOverwriteData);
      }
    }
  },
};
