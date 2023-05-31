const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

(async () => {
  try {
    const files = fs.readdirSync(commandsPath);
	console.log('\x1b[36m%s\x1b[0m',`\n----- Loading ${files.length} Commands -----\n`);

    files.forEach((file) => {
      const command = require(path.join(commandsPath, file));
      commands.push(command);
	  console.log(`[Commands] Loaded ${file}`);
    });

    console.log('\x1b[36m%s\x1b[0m',`\n----------- Login. -----------\n`);

  } catch (error) {

    console.error(error);

  }
})();
