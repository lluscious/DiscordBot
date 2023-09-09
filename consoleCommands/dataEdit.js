const { user } = require("../client");
const fs = require("node:fs");
const path = require("node:path");

module.exports = () => {
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    const args = input.split(" ");
    if (args[0] === "bot.Data.edit") {
      const command = args[0];
      const id = args[1];
      const newData = args[2];

      delete require.cache[require.resolve("../data/userProfileData.json")];
      const profile_path = path.join(__dirname, "../data/userProfileData.json");
      const profile = fs.readFileSync(profile_path);
      const profileData = JSON.parse(profile);

      delete require.cache[require.resolve("../data/userProfileData.json")];
      const likes_path = path.join(__dirname, "../data/userProfileData.json");
      const likes = fs.readFileSync(likes_path);
      const likesData = JSON.parse(likes);

      delete require.cache[require.resolve("../data/userProfileData.json")];
      const user_path = path.join(__dirname, "../data/userProfileData.json");
      const user = fs.readFileSync(user_path);
      const userData = JSON.parse(user);

      const usernameData = require("../data/userProfileData.json");
      let editing = true;

      if (usernameData[id] == undefined) {
        console.log(`[Data] ${id} not found within data.\n`);
        return;
      }

      process.stdout.write(`[Editing_${id}] Insert object to edit: `);
        process.stdin.on("data", (data) => {
            if (editing == true) {
          const object = data.toString().trim();
          const profileObj = [
            "desc",
            "color",
            "footer",
            "ficon",
            "icon",
            "url",
          ];
          const likeObj = ["likes", "liked"];
          if (profileObj.includes(object)) {
            profileData[`${id}_${object}`] = newData;
            fs.writeFileSync(profile_path, JSON.stringify(profileData));
            console.log(
              `[Editing_${id}] Successfully changed ${id}'s ${object} to ${newData}`
            );
            editing = false
            return;
          } else if (object.endsWith(likeObj)) {
            likesData[`${id}_${object}`] = newData;
            fs.writeFileSync(likes_path, JSON.stringify(likesData));
            console.log(
              `[Editing_${id}] Successfully changed ${id}'s ${object} to ${newData}`
            );
            editing = false
            return;
          } else if (object == "user") {
            userData[`${id}`] = newData;
            fs.writeFileSync(user_path, JSON.stringify(userData));
            console.log(
              `[Editing_${id}] Successfully changed ${id}'s ${object} to ${newData}`
            );
            editing = false
            return;
          } else {
            console.log(`[Editing_${id}] Invalid Object.`);
            return;
          }
        }});
      }
    }
  );
};
