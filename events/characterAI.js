const { Events, MessageType } = require("discord.js");
const client = require("../client");

(async () => {
  delete require.cache[require.resolve("../data/config/commandConfigData.json")];
  const {EventCAIMessage} = require("../data/config/commandConfigData.json");
  if (EventCAIMessage == true){
    try {
        const CharacterAI = require("node_characterai");
        const characterAI = new CharacterAI();
        await characterAI.authenticateAsGuest();
        const characterId = "0O5Qu-qyTsRTbMFqRtMVmopidcdHVFK1ZfPheOfppIA";
        const chat = await characterAI.createOrContinueChat(characterId);
       client.on(Events.MessageCreate, async (message) => {
        if (message.content.startsWith(`<@1094952046035222559>`) || message.content.startsWith(`@✦ Neuvy`)) {
          try {

            if (message.author.bot) return;

            message.channel.sendTyping();
            const prompt = message.content;
            const response = await chat.sendAndAwaitResponse(prompt, true);

            message.reply(response.text)

          } catch (error) {
            message.reply({content: error, ephemeral: true})
          }

        }
      }
        );

      } catch (authError) {
        console.error(authError);
  }
}})();    