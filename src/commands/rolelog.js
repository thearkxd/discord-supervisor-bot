const emojis = require("../configs/emojis.json");
const moment = require("moment");
moment.locale("tr");
const roles = require("../schemas/roles");

module.exports = {
  conf: {
    aliases: ["rolelog"],
    name: "rollog",
    help: "rollog [kullanıcı]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "Bir kullanıcı belirtmelisin!");
    let data = await roles.findOne({ guildID: message.guild.id, userID: member.user.id, });
    if (!data) return message.channel.send(embed.setDescription(`${member.toString()} üyesinin rol geçmişi bulunmuyor!`));
    data = data.roles.sort((a, b) => b.date - a.date).map((x) => `${x.type ? emojis.green + " Rol verildi" : emojis.red + " Rol alındı"}. Rol: <@&${x.role}>, Yetkili: <@${x.staff}> \nTarih: ${moment(x.date).format("LLL")} \`(${moment(x.date).fromNow()})\``).join("\n**────────────**\n");
    embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }));
    for (var i = 0; i < Math.floor(data.length / 2000); i++) {
      message.channel.send(embed.setDescription(data.slice(0, 2000)));
      data = data.slice(2000);
    }
    if (data.length > 0) message.channel.send(embed.setDescription(data));
  },
};
