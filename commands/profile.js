const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  Events,
  EmbedBuilder,
} = require("discord.js");
const path = require("path");
const client = require("../client");
const fs = require("node:fs");

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
            .setDescription("user's profile to like")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("register")
        .setDescription("Register your profile for the bot")
    ),
  async execute(interaction) {
    const Subcommand = interaction.options.getSubcommand();

    // ---------------------------------  Subcommand : View  ---------------------------------  //

    if (Subcommand === "view") {
      const interGetUser = interaction.options.getUser("user");
      const intUserID = interGetUser.id;
      delete require.cache[require.resolve("../data/userProfileData.json")];
      const userData = require("../data/userProfileData.json");
      if (!(intUserID in userData)) {
        interaction.reply(
          "User isn't registered, Please register using the /register command!"
        );
      } else {
        const avatarURL = interGetUser.avatarURL({
          format: "png",
          size: 4096,
        });
        const username = userData[intUserID].strUser;
        const likes = userData[intUserID].intLikes;
        const liked = userData[intUserID].intLiked;
        const color = userData[intUserID].strProfile_color;
        const desc = userData[intUserID].strProfile_desc;
        const bannerURL = userData[intUserID].strProfile_url;
        const icon = userData[intUserID].strProfile_icon;
        const footer = userData[intUserID].strProfile_footer;
        const ficon = userData[intUserID].strProfile_ficon;

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
            value: interGetUser.tag,
          })
          .addFields({
            name: "Join Date",
            value: interGetUser.createdAt.toUTCString(),
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

        if (intUserID == interaction.user.id) {
          await profile.setTitle(`✦ Your Profile (${username})`);
          await interaction.reply({
            embeds: [profile],
          });
        } else {
          await interaction.reply({
            embeds: [profile],
          });
        }
      }
    }

    // ---------------------------------  Subcommand : Edit --------------------------------- //
    else if (Subcommand === "edit") {
      const type = interaction.options.getString("type");
      delete require.cache[require.resolve("../data/userProfileData.json")];
      const usernameJSON = require("../data/userProfileData.json");

      const id = interaction.user.id;
      if (!(id in usernameJSON)) {
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
                newUser = userData[intUserID].strUser;
              }

              if (!newDesc) {
                newDesc = userData[intUserID].strProfile_desc;
              } else if (newDesc == "N/A") {
                newDesc = "";
              }

              if (!newColor) {
                newColor = userData[intUserID].strProfile_color
              }

              resolve();

              // Edit data
              delete require.cache[
                require.resolve("../data/userProfileData.json")
              ];
              const intUserID = interaction.user.id;
              const userDataPath = path.join(
                __dirname,
                "../data/userProfileData.json"
              );
              const userDataF = fs.readFileSync(userDataPath);
              const userData = JSON.parse(userDataF);
              userData[intUserID].strUser = newUser;
              userData[intUserID].strProfile_desc = newDesc;
              userData[intUserID].strProfile_color = newColor;
              fs.writeFileSync(userDataPath, JSON.stringify(userData));

              // Reply
              interaction.reply({
                content: `Successfully edited profile!`,
                ephemeral: true,
              });
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
              const intUserID = interaction.user.id;
              const userDataPath = path.join(
                __dirname,
                "../data/userProfileData.json"
              );
              const userDataF = fs.readFileSync(userDataPath);
              const userData = JSON.parse(userDataF);
              if (!newURL) {
                newURL = userData[intUserID].strProfile_url;
              } else if (newURL == "N/A") {
                newURL = "None";
              }
              if (!newIcon) {
                newIcon = userData[intUserID].strProfile_icon;
              } else if (newIcon == "N/A") {
                newIcon = "None";
              }
              if (!newFooter || newFooter == "") {
                newIcon = userData[intUserID].strProfile_icon;
              } else if (newFooter == "N/A") {
                newFooter = "...";
              }
              if (!newFicon) {
                newFicon = userData[intUserID].strProfile_ficon;
              } else if (newFicon == "N/A") {
                newFicon = "None";
              }

                userData[intUserID].strProfile_url = newURL;
                userData[intUserID].strProfile_icon = newIcon;
                userData[intUserID].strProfile_footer = newFooter;
                userData[intUserID].strProfile_ficon = newFicon;
                fs.writeFileSync(userDataPath, JSON.stringify(userData));
              

              resolve();
              interaction.reply(`Successfully Edited Profile!`);
            }
          }
        });
      });
    }

    // ---------------------------------  Subcommand : Like --------------------------------- //

    if (Subcommand == "like") {
      const user = interaction.options.getUser("user");
      if (user.id == interaction.user.id) {
        interaction.reply({
          content: `You can't like your own profile!`,
          ephemeral: true,
        });
        return;
      }
      delete require.cache[require.resolve("../data/userProfileData.json")];
      const userData = require("../data/userProfileData.json");
      const userData_path = path.join(
        __dirname,
        "../data/userProfileData.json"
      );
      const userDataF = fs.readFileSync(userData_path);
      const userDataD = JSON.parse(userDataF);
      const newLikesAmount = userDataD[user.id].intLikes + 1;
      const newLikedAmount = userDataD[user.id].intLiked + 1;
      userDataD[user.id].intLikes = newLikesAmount;
      userDataD[interaction.user.id].intLiked = newLikedAmount;
      fs.writeFileSync(likes_path, JSON.stringify(userDataD));

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
    if (Subcommand == "register") {
      delete require.cache[require.resolve("../data/userProfileData.json")];
      const userProdileData = require("../data/userProfileData.json");

      if (interaction.user.id in userProdileData) {
        interaction.reply("You are already registered!");
        return;
      } else {
        const form = new ModalBuilder()
          .setCustomId("register")
          .setTitle("intUserID Registration");

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

        const userDataPath = path.join(
          __dirname,
          "../data/userProfileData.json"
        );
        const userDataF = await fs.readFile(userDataPath, "utf8");
        const userData = JSON.parse(userDataF);
        userData[interaction.user.id] = {
          strUser: usernameInput,
          intLikes: 0,
          intLiked: 0,
          strProfile_color: "#000000",
          strProfile_desc: "?",
          strProfile_url: "None",
          strProfile_icon: "None",
          strProfile_footer: "Customize your profile by using /profile edit!",
          strProfile_ficon: "None",
        };
        const userDataOverrite = JSON.stringify(userData, null, 2);
        await fs.writeFile(userDataPath, userDataOverrite);
      }
    }
  },
};
