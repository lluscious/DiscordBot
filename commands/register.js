const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Events } = require("discord.js");
const fs = require('fs').promises;
const path = require('path');
const client = require('../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register your profile to the database"),
  async execute(interaction) {

    //---------------------------------------- Check if already registered ----------------------------------------\\

    delete require.cache[require.resolve("../data/username.json")];
    const usernameData = require("../data/username.json");

    if (interaction.user.id in usernameData) {
      interaction.reply("You are already registered!");
      return;
    }

    //---------------------------------------- Modal ----------------------------------------\\

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

    //---------------------------------------- Collect Modal Data ----------------------------------------\\

    let usernameInput;

    await new Promise((resolve) => {
      client.on(Events.InteractionCreate, (interaction) => {
        if (!interaction.isModalSubmit()) return;
        usernameInput = interaction.fields.getTextInputValue('username');
        console.log(`[Registration] Created ${usernameInput}`);
        resolve();
      });
    });

    //---------------------------------------- Create Profile ----------------------------------------\\

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
    profileData[`${interaction.user.id}_color`] = "Default";
    profileData[`${interaction.user.id}_desc`] = "Default";
    profileData[`${interaction.user.id}_bannerURL`] = "None";
    const profileOverwriteData = JSON.stringify(profileData, null, 2);
    await fs.writeFile(profilePath, profileOverwriteData);


    //---------------------------------------- Reply ----------------------------------------\\

    

  },
};
