const fs = require('fs');
const path = require('path');
const commands = [];
const commandsPath = path.join(__dirname, 'commands');

(async () => {
  try {
    const files = fs.readdirSync(commandsPath);
	console.log(`\n----- Loading ${files.length} Commands -----\n`);
    files.forEach((file) => {
      const command = require(path.join(commandsPath, file));
      commands.push(command);
	  console.log(`[Commands] Loaded ${file}`);
    });
    console.log(`\n----------- Login. -----------\n`);
  } catch (error) {
    console.error(error);
  }
})();
