const conf = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: ["unregister"],
    name: "kayıtsız",
    help: "kayıtsız",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!conf.registration.staffs.some((x) => message.member.roles.cache.has(x)) && !message.member.hasPermission(8)) return message.channel.error(message, "Kayıt işlemleri için gerekli yetkiye sahip değilsin!");
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "Bir üye belirtmelisin!");
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "Belirttiğin kişi senden daha yetkili ya da aynı yetkide!");

    await member.setRoles(conf.registration.unregRoles);
    if (member.user.username.includes(conf.tag.tag)) await member.setNickname(`${conf.tag.tag} İsim${conf.registration.brace}Yaş`);
    else await member.setNickname(`${conf.tag.tag2} İsim${conf.registration.brace}Yaş`);

    embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }));
    message.channel.send(embed.setDescription(`${member.toString()} üyesi başarıyla kayıtsıza atıldı!`));
  },
};
