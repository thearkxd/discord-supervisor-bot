const conf = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: [],
    name: "dağıt",
    help: "dağıt",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */
  
  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8)) return;
    if (!message.member.voice.channelID) return message.channel.error(message, "Bir ses kanalında bulunmalısın!");

    const deafeds = message.member.voice.channel.members.filter((x) => x.voice.selfDeaf);
    const notDeafeds = message.member.voice.channel.members.filter((x) => !x.voice.selfDeaf);

    const publicChannels = message.guild.channels.cache.filter((x) => x.parentID && x.parentID === conf.publicParent);
    
    deafeds.forEach((x, index) => {
      client.wait(index * 1000);
      x.voice.setChannel(conf.sleepRoom);
    });

    notDeafeds.forEach((x, index) => {
      client.wait(index * 1000);
      x.voice.setChannel(publicChannels.random());
    });

    message.channel.send(embed.setDescription(`Başarıyla \`${deafeds.size}\` kişi sleep odasına, \`${notDeafeds.size}\` kişi public kanallara dağıtıldı!`));
  },
};