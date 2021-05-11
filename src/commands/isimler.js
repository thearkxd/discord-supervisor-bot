const nameData = require("../schemas/names");

module.exports = {
  conf: {
    aliases: ["names"],
    name: "isimler",
    help: "isimler [kullanıcı]"
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await nameData.findOne({ guildID: message.guild.id, userID: member.user.id });

    embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }));
    embed.setTitle(`${member.user.username} üyesinin isim bilgileri;`);
    message.channel.send(embed.setDescription(data ? `${data.names.map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol})`).join("\n")}` : "Sunucuda önceden kayıtlı ismi bulunmuyor!"));
  }
};
