module.exports = () => {
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    const args = input.split(" ");
    if (args[0] === "bot.cmd.run") {
      const command = args[0];
      const id = args[1];
      process.stdout.write(`[Eval] Insert Code to run:`);
      process.stdin.on("data", (data) => {
        const code = data.toString().trim();
        try {
          eval(code);
        } catch (error) {
          console.error("[Error] Error occurred while running the code:", error);
        }
      });
    }
  });
};
