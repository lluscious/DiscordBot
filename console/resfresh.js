module.exports = () => {
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    if (input == "bot.refresh") {
      console.log("[Bot] Restarting...");
      client.destroy();
      client.login(token);
      console.log("[Bot] Restart complete!");
    }
  });
};
