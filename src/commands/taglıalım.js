const { Database } = require("ark.db");
const db = new Database("/src/configs/config.json");

module.exports = {
  conf: {
    aliases: ["taglı-alım"],
    name: "taglıalım",
    help: "taglıalım [aç/kapat]",
    owner: true
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!args[0] || !["aç", "kapat"].includes(args[0])) return message.channel.error(message, "Geçerli bir argüman belirtmelisin! (`aç` ya da `kapat`)");
    await db.set("taglıAlım", args[0] === "aç");
    message.channel.send(embed.setDescription(`Taglı alım başarıyla ${args[0] === "aç" ? "açıldı!" : "kapatıldı!"}`));
  },
};
