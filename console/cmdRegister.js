const { REST, Routes } = require("discord.js");
const { token } = require("../token.json");
const fs = require("fs");
const path = require("path");
const clientId = "1094952046035222559";
const rest = new REST({ version: "10" }).setToken(token);

module.exports = () => {
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    const args = input.split(" ");
    if (args[0] === "bot.cmd.register") {
      const command = args[0];
      const cmd = args[1];

      if (cmd == "all") {
        require("../register");
      } else if (cmd == null) {
        console.error(`Invalid Arguments.\nUsage: bot.cmd.register [cmd]\nEg: bot.cmd.register about\n`)
      } else if (!cmd.includes('../commands/')) {
        console.error(`Invalid Command: ${cmd}\n`)
      }else {

        const commands = [];
        commands.push(require(`../commands/${cmd}.js`).data.toJSON());

        (async () => {
          try {
            console.log(`[Commands] Registering ${cmd}.js`);

            await rest.put(
              Routes.applicationCommands(clientId),
              { body: commands }
            );

            console.log(`[Commands] Successfully registered ${cmd}.js\n`);
            console.log(
              "\x1b[36m%s\x1b[0m",
              `----------- Console ----------\n`
            );
          } catch (error) {
            console.error(error);
          }
        })();
      }
    }
  });
};
