const { Events } = require("discord.js");
const client = require("../client");
const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();
function truncateString(inputString, maxLength) {
  if (inputString.length > maxLength) {
    return inputString.substring(0, maxLength);
  }
  return inputString;
}

(async () => {
  delete require.cache[require.resolve("../data/config/commandConfigData.json")];
  const {EventCAIMessage} = require("../data/config/commandConfigData.json");
    try {
    await characterAI.authenticateAsGuest();
    const characterId = "IC-9wkDjyCqGV-_Gjs9i88hM0yUrL8TEdApWOWLAl48";
    const chat = await characterAI.createOrContinueChat(characterId);
    client.on(Events.MessageCreate, async (message) => {
      if (EventCAIMessage == true){
      try {
        delete require.cache[require.resolve("../data/config/channelConfigData.json")];
        const { BotChatCAIChannel } = require("../data/config/channelConfigData.json");
        if (message.author.bot || message.channelId !== BotChatCAIChannel) return;
        message.channel.sendTyping();
        const prompt = message.content;
        const response = await chat.sendAndAwaitResponse(prompt, true);
        message.channel.send(response.text)
      } catch (error) {
        console.error("Error handling message:", error);
      }
    } else {
      return;
    }
  }
    );
  } catch (authError) {
    console.error(authError);
  }})();
