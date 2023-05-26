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
    .setName("like")
    .setDescription("Like someones profile")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user's profile to like")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    if (user.id == interaction.user.id){
        interaction.reply({content:`You can't like your own profile!`, ephemeral:true})
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

    if (!(user.id in LikeAmount || interaction.user.id in LikeAmount)){
      return interaction.reply({content: 'User not registered!', ephemeral: true})
    }

    interaction.reply({ content: `Successfully liked ${user.tag}'s profile!`, ephemeral: true });
    client.users.send(`${user.id}`, `${interaction.user.tag} liked your profile!`)
  },
};
