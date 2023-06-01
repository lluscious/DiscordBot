module.exports = () => {
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    const args = input.split(" "); // LYUU FINDS OUT ABOUT ARGS AND ITS THE BEST THING EVER!>>!?!?!?
    if (args[0] === "bot.Data.view") {
      const command = args[0];
      const id = args[1];

      const usernameData = require("../data/username.json");
      const profileData = require("../data/profile.json");
      const likesData = require("../data/likes.json");

      if (usernameData[id] == undefined) {
        console.log(`[Data] ${id} not found within data.\n`);
        return;
      }

      console.log(`----------- ${usernameData[id]} in data ----------\n`);
      console.log(`[Data/likesData] ${likesData[`${id}_likes`]} likes`);
      console.log(`[Data/likesData] ${likesData[`${id}_liked`]} liked`);
      console.log(
        `[Data/ProfileData] Embed Color: ${profileData[`${id}_color`]}`
      );
      console.log(
        `[Data/ProfileData] Description: ${profileData[`${id}_desc`]}`
      );
      console.log(`[Data/ProfileData] Banner Url: ${profileData[`${id}_url`]}`);
      console.log(`[Data/ProfileData] Icon Url: ${profileData[`${id}_icon`]}`);
      console.log(
        `[Data/ProfileData] Footer Text: ${profileData[`${id}_footer`]}`
      );
      console.log(
        `[Data/ProfileData] Footer Icon: ${profileData[`${id}_ficon`]}`
      );
    }
  });
};
