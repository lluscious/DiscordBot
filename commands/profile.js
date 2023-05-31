const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  Events,
  EmbedBuilder,
  AutoModerationActionExecution,
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
            .setName("type")
            .setDescription("Type of profile objects to edit")
            .setRequired(true)
            .addChoices(
              { name: "Basic", value: "choice_basic" },
              { name: "Details", value: "choice_details" }
            )
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
      const avatarURL = l.avatarURL({
        format: "png",
        size: 4096,
      });

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
      const icon = profileData[`${user}_icon`];
      const footer = profileData[`${user}_footer`];
      const ficon = profileData[`${user}_ficon`];

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
          .addFields({
            name: "Discord Username",
            value: l.tag,
          })
          .addFields({
            name: "Join Date",
            value: l.createdAt.toUTCString(),
          })
          .setFooter({ text: footer })
          .setColor(color)
          .setDescription(desc)
          .setTimestamp();

        if (bannerURL !== "None") {
          profile.setImage(bannerURL);
        }

        if (icon !== "None") {
          profile.setThumbnail(icon);
        } else {
          profile.setThumbnail(avatarURL);
        }

        if (ficon !== "None") {
          profile.setFooter({
            text: footer,
            iconURL: ficon,
          });
        }

        try {
          if (user == interaction.user.id) {
             await profile.setTitle(`✦ Your Profile (${username})`);
            await interaction.reply({
              embeds: [profile],
            });
          } else {
            await interaction.reply({
              embeds: [profile],
            });
          }
        } catch (error) {
          await interaction.reply('An error occured while loading data, Sending error...')
          await interaction.followUp(`${error}`)
        }
      }
    }

    // ---------------------------------  Subcommand : Edit --------------------------------- //
    else if (sub === "edit") {
      const type = interaction.options.getString("type");
      delete require.cache[require.resolve("../data/username.json")];
      const usernameJSON = require("../data/username.json");
      delete require.cache[require.resolve("../data/profile.json")];
      const profileJSON = require("../data/profile.json");

      const id = interaction.user.id;
      if (!(interaction.user.id in usernameJSON)) {
        interaction.reply(`${id} data not found!`);
        return;
      }

      if (type == "choice_basic") {
        const editor = new ModalBuilder()
          .setCustomId("editor_basic")
          .setTitle("Editing Profile (leave blank if not editing)");

        // Modal Components
        const usernameModal = new TextInputBuilder()
          .setCustomId("input_username")
          .setMinLength(3)
          .setMaxLength(20)
          .setRequired(false)
          .setLabel("Username")
          .setStyle(TextInputStyle.Short);

        const descriptionModal = new TextInputBuilder()
          .setCustomId("input_description")
          .setMaxLength(40)
          .setRequired(false)
          .setLabel('Description (Put "N/A" to remove)')
          .setStyle(TextInputStyle.Paragraph);

        const embedColorModal = new TextInputBuilder()
          .setCustomId("input_color")
          .setMinLength(7)
          .setMaxLength(7)
          .setRequired(false)
          .setLabel("Embed Color")
          .setStyle(TextInputStyle.Short);

        // Collect Modal Data
        const userActionRow = new ActionRowBuilder().addComponents(
          usernameModal
        );
        const descActionRow = new ActionRowBuilder().addComponents(
          descriptionModal
        );
        const embedColorActionRow = new ActionRowBuilder().addComponents(
          embedColorModal
        );

        editor.addComponents(userActionRow, descActionRow, embedColorActionRow);
        interaction.showModal(editor);

        let newUser;
        let newDesc;
        let newColor;
      } else if (type == "choice_details") {
        const editor = new ModalBuilder()
          .setCustomId("editor_details")
          .setTitle("Editing Profile (leave blank if not editing)");

        const bannerModal = new TextInputBuilder()
          .setCustomId("input_banner")
          .setLabel('Banner Image URL (Put "N/A" to remove)')
          .setRequired(false)
          .setStyle(TextInputStyle.Short);

        const iconModal = new TextInputBuilder()
          .setCustomId("input_icon")
          .setLabel('Icon URL (Put "N/A" to remove)')
          .setRequired(false)
          .setStyle(TextInputStyle.Short);

        const footerModal = new TextInputBuilder()
          .setCustomId("input_footer")
          .setMinLength(0)
          .setMaxLength(20)
          .setRequired(false)
          .setLabel('Footer Text (Put "N/A" to remove)')
          .setStyle(TextInputStyle.Short);

        const ficonModal = new TextInputBuilder()
          .setCustomId("input_ficon")
          .setMinLength(7)
          .setMaxLength(7)
          .setRequired(false)
          .setLabel('Footer Icon (Put "N/A" to remove')
          .setStyle(TextInputStyle.Short);

        // Collect Modal Data
        const bannerActionRow = new ActionRowBuilder().addComponents(
          bannerModal
        );
        const iconActionRow = new ActionRowBuilder().addComponents(iconModal);
        const footerActionRow = new ActionRowBuilder().addComponents(
          footerModal
        );
        const ficonActionRow = new ActionRowBuilder().addComponents(ficonModal);

        editor.addComponents(
          bannerActionRow,
          iconActionRow,
          footerActionRow,
          ficonActionRow
        );
        interaction.showModal(editor);

        let newURL;
        let newIcon;
        let newFooter;
        let newFicon;
      }

      // Data collecting and other stuff for the modals

      await new Promise((resolve) => {
        client.on(Events.InteractionCreate, (interaction) => {
          if (type === "choice_basic") {
            if (
              interaction.isModalSubmit() &&
              interaction.customId === "editor_basic"
            ) {
              // Take input values
              newUser = interaction.fields.getTextInputValue("input_username");
              newDesc =
                interaction.fields.getTextInputValue("input_description");
              newColor = interaction.fields.getTextInputValue("input_color");

              // Input Values
              if (!newUser) {
                newUser = usernameJSON[`${interaction.user.id}`];
              }

              if (!newDesc) {
                newDesc = profileJSON[`${interaction.user.id}_desc`];
              } else if (newDesc == "N/A") {
                newDesc = "";
              }

              if (!newColor) {
                newColor = profileJSON[`${interaction.user.id}_color`];
              }

              resolve();

              // Edit data
              delete require.cache[require.resolve("../data/username.json")];
              const username_path = path.join(
                __dirname,
                "../data/username.json"
              );
              const user = fs.readFileSync(username_path);
              const userData = JSON.parse(user);
              userData[id] = newUser;
              fs.writeFileSync(username_path, JSON.stringify(userData));

              delete require.cache[require.resolve("../data/profile.json")];
              const profile_path = path.join(__dirname, "../data/profile.json");
              const profile = fs.readFileSync(profile_path);
              const profileData = JSON.parse(profile);
              profileData[`${id}_desc`] = newDesc;
              profileData[`${id}_color`] = newColor;
              fs.writeFileSync(profile_path, JSON.stringify(profileData));

              // Reply
              interaction.reply(`Successfully Edited Profile!`);
            }
          } else if (type === "choice_details") {
            if (
              interaction.isModalSubmit() &&
              interaction.customId === "editor_details"
            ) {
              newURL = interaction.fields.getTextInputValue("input_banner");
              newIcon = interaction.fields.getTextInputValue("input_icon");
              newFooter = interaction.fields.getTextInputValue("input_footer");
              newFicon = interaction.fields.getTextInputValue("input_ficon");
              if (!newURL) {
                newURL = profileJSON[`${interaction.user.id}_url`];
              } else if (newURL == "N/A") {
                newURL = "None";
              }
              if (!newIcon) {
                newIcon = profileJSON[`${interaction.user.id}_icon`];
              } else if (newIcon == "N/A") {
                newIcon = "None";
              }
              if (!newFooter) {
                newFooter = profileJSON[`${interaction.user.id}_footer`];
              } else if (newFooter == "N/A") {
                newFooter = "";
              }
              if (!newFicon) {
                newFicon = profileJSON[`${interaction.user.id}_ficon`];
              } else if (newFicon == "N/A") {
                newFicon = "None";
              } // yandere dev coding moment

              delete require.cache[require.resolve("../data/profile.json")];
              const profile_path = path.join(__dirname, "../data/profile.json");
              const profile = fs.readFileSync(profile_path);
              const profileData = JSON.parse(profile);
              profileData[`${id}_url`] = newURL;
              profileData[`${id}_icon`] = newIcon;
              profileData[`${id}_footer`] = newFooter;
              profileData[`${id}_ficon`] = newFicon;
              fs.writeFileSync(profile_path, JSON.stringify(profileData));

              resolve();
              interaction.reply(`Successfully Edited Profile!`);
            }
          }
        });
      });
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
      user.send({
        embeds: [likeDM],
      });
    }

    // ---------------------------------  Subcommand : Register --------------------------------- //
    if (sub == "register") {
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
        profileData[`${interaction.user.id}_icon`] = "None";
        profileData[`${interaction.user.id}_footer`] =
          "Customize your profile by using /profile edit!";
        profileData[`${interaction.user.id}_ficon`] = "None";
        const profileOverwriteData = JSON.stringify(profileData, null, 2);
        await fs.writeFile(profilePath, profileOverwriteData);
      }
    }
  },
};
