console.clear();
console.log("\x1b[36m%s\x1b[0m", `---- Loading Presquisites ----\n`);
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

  const permissionData = require('./data/permissionData.json')
  const userPermission = permissionData[interaction.user.i]

  try {
    await command.execute(interaction);
  } catch (error) {
    return console.error(error);
  }
});

// ---------------------------------  Status  ---------------------------------  //
client.once(Events.ClientReady, (c) => {

  client.user.setPresence({
    activities: [{ name: "lyuu crying", type: ActivityType.Listening }],
    status: "dnd",
  });

  console.log(`[Bot] Successfully logged in as ${c.user.tag}\n`);
  console.log("\x1b[36m%s\x1b[0m", `----------- Console ----------\n`);
});

// ---------------------------------  Shell Commands  ---------------------------------  //

function cmd(command) {
  try {
    return require("child_process").execSync(command);
  } catch (err) {
    console.log(err);
  }
}

const cmdsDir = path.join(__dirname, "console");
fs.readdirSync(cmdsDir).forEach((file) => {
  console.log(`[Console_Commands] ${file} Loaded`);
  const command = require(path.join(cmdsDir, file));
  command();
});

// ---------------------------------  Deploy and login  ---------------------------------  //
const l = path.join(__dirname, "events");
fs.readdirSync(l).forEach((file) => {
  console.log(`[Events] ${file} Loaded`);
  require(path.join(l, file));
});

require("./deploy");
client.login(token);
