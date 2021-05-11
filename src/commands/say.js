const conf = require("../configs/config.json");
const emojis = require("../configs/emojis.json");

module.exports = {
  conf: {
    aliases: [],
    name: "say",
    help: "say",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8)) return;
    embed.setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }));
    embed.setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    embed.setDescription(`
${emojis.ates} Sunucumuzda **toplam** ${client.numEmoji(message.guild.memberCount)} kullanıcı bulunmaktadır.
${emojis.ates} Şu an ${client.numEmoji(message.guild.members.cache.filter((x) => x.user.presence.status !== "offline").size)} **online** kullanıcı bulunmaktadır.
${emojis.ates} **Tagımızda** ${client.numEmoji(message.guild.members.cache.filter((x) => x.user.username.includes(conf.tag.tag)).size)} kullanıcı bulunmaktadır.
${emojis.ates} Sunucumuzda ${client.numEmoji(message.guild.members.cache.filter((x) => x.premiumSince).size)} adet **booster** bulunmaktadır.
${emojis.ates} **Ses kanallarında** ${client.numEmoji(message.guild.members.cache.filter((x) => x.voice.channel).size)} kullanıcı bulunmaktadır.
    `);

    message.channel.send(embed);
  },
};
