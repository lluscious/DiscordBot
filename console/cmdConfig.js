const fs = require("node:fs");
const path = require("node:path");

module.exports = () => {
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    const args = input.split(" ");
    if (args[0] === "bot.Data.config") {
      const command = args[0];
      const object = args[1];
      const newValue = args[2];

      const channelConfigData = require("../data/config/channelConfigData.json");
      const commandConfigData = require("../data/config/commandConfigData.json");

      delete require.cache[require.resolve("../data/config/channelConfigData.json")];
      const channel_path = path.join(__dirname, "../data/config/channelConfigData.json");
      const channel = fs.readFileSync(channel_path);
      const channelData = JSON.parse(channel);

      delete require.cache[require.resolve("../data/config/commandConfigData.json")];
      const command_path = path.join(__dirname, "../data/config/commandConfigData.json");
      const cmd = fs.readFileSync(command_path);
      const commandData = JSON.parse(cmd);

      if (object in channelConfigData) {
        channelConfigData[object] = newValue;
        fs.writeFileSync(channel_path, JSON.stringify(channelData))
        console.log(`[Config] Successfully configured ${object}!`)
      } else if (object in commandConfigData) {
        commandConfigData[object] = newValue;
        fs.writeFileSync(command_path, JSON.stringify(commandData))
        console.log(`[Config] Successfully configured ${object}!`)
      } else {
        console.log(`[Config] Object not found!`);
        return;
      }

    }
  });
};
