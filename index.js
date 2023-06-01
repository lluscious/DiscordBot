console.clear();
console.log(`------- Loading Events -------\n`);

const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActionRowBuilder,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");
const { token } = require("./token.json");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
module.exports = client;

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[Warning] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// ---------------------------------  Command Error Logging  ---------------------------------  //
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    return console.error(error);
  }
});

// ---------------------------------  Status  ---------------------------------  //
client.once(Events.ClientReady, (c) => {
  client.user.setPresence({
    activities: [{ name: "/Kazu!", type: ActivityType.Watching }],
    status: "dnd",
  });
  let index = 0;
  setInterval(() => {
    if (index === 0) {
      client.user.setPresence({
        activities: [{ name: "lyuu crying", type: ActivityType.Listening }],
        status: "dnd",
      });
      index = 1;
    } else {
      client.user.setPresence({
        activities: [{ name: "/Kazu!", type: ActivityType.Watching }],
        status: "dnd",
      });
      index = 0;
    }
  }, 30000);
  console.log(`[Bot] Successfully logged in as ${c.user.tag}\n`);
  console.log(`----------- Console ----------\n`);
});

// ---------------------------------  Shell Commands  ---------------------------------  //
function doShellCmd(command) {
  try {
    return require("child_process").execSync(command);
  } catch (err) {
    console.log(err);
  }
}

// bot.refresh
process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (input == "bot.refresh") {
    console.log('[Bot] Restarting...')
    client.destroy()
    client.login(token)
    console.log('[Bot] Restart complete!')
  }
  if (input == "bot.Data.update") {
    if (process.platform === "linux" || process.platform === "android") {
      doShellCmd(
        `git commit -m Data_Update_${process.platform} ./data/* && git push`
      );
    } else if (process.platform === "win32") {
      doShellCmd(
        `git commit -m Data_Update_${process.platform} ./data/* && git push`
      );
    }
  }

  const args = input.split(" "); // LYUU FINDS OUT ABOUT ARGS AND ITS THE BEST THING EVER!>>!?!?!?
  if (args[0] === "bot.Data.view") {
    const command = args[0];
    const id = args[1];

    const usernameData = require("./data/username.json");
    const profileData = require("./data/profile.json");
    const likesData = require("./data/likes.json");

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
    console.log(`[Data/ProfileData] Description: ${profileData[`${id}_desc`]}`);
    console.log(`[Data/ProfileData] Banner Url: ${profileData[`${id}_url`]}`);
    console.log(`[Data/ProfileData] Icon Url: ${profileData[`${id}_icon`]}`);
    console.log(
      `[Data/ProfileData] Footer Text: ${profileData[`${id}_footer`]}`
    );
    console.log(
      `[Data/ProfileData] Footer Icon: ${profileData[`${id}_ficon\n`]}`
    );
  }
});
  

// ---------------------------------  Deploy and login  ---------------------------------  //
const l = path.join(__dirname, "events");
fs.readdirSync(l).forEach((file) => {
  require(path.join(l, file));
});
require("./deploy");
client.login(token);
