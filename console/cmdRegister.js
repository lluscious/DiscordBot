module.exports = () => {
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    if (input == "bot.cmd.register") {
      require("../utils/register");
    }
  });
};
