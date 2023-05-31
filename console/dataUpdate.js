module.exports = () => {
  
  process.stdin.on("data", (data) => {
    const input = data.toString().trim();
    if (input == "bot.Data.update") {
      if (process.platform === "linux" || process.platform === "android") {
        cmd(
          `git commit -m Data_Update_${process.platform} ./data/* && git push`
        );
      } else if (process.platform === "win32") {
        cmd(
          `git commit -m Data_Update_${process.platform} ./data/* && git push`
        );
      }
    }
  });
};
