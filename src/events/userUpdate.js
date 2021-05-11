const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const client = global.client;
const bannedTag = require("../schemas/bannedTag");

/**
 * @param { Client } client
 * @param { ClientUser } oldUser
 * @param { ClientUser } newUser
 */

module.exports = async (oldUser, newUser) => {
  if (oldUser.bot || newUser.bot || (oldUser.username === newUser.username)) return;
  const guild = client.guilds.cache.get(conf.guildID);
  if (!guild) return;
  const member = guild.members.cache.get(oldUser.id);
  if (!member) return;
  const channel = guild.channels.cache.get(conf.tag.log);

  if (oldUser.username.includes(conf.tag.tag) && !newUser.username.includes(conf.tag.tag)) {
    if (member.manageable && member.displayName.includes(conf.tag.tag)) member.setNickname(member.displayName.replace(conf.tag.tag, conf.tag.tag2));
    if (conf.taglıAlım && !member.premiumSince) member.roles.set(conf.registration.unregRoles);
    else member.roles.remove(conf.tag.role);
    if (!channel) return;
    const embed = new MessageEmbed()
      .setAuthor(member.displayName,  newUser.displayAvatarURL({ dynamic: true }))
      .setTitle("• Bir kullanıcı tag saldı!")
      .setColor("RED")
      .setDescription(`
${member.toString()} kullanıcısı ${conf.tag.tag} tagını saldığı için <@&${conf.tag.role}> rolü alındı.
Aktif taglı sayısı: ${guild.members.cache.filter(x => x.user.username.includes(conf.tag.tag)).size}
       `);
    channel.send(embed);
  } else if (!oldUser.username.includes(conf.tag.tag) && newUser.username.includes(conf.tag.tag)){
    if (member.manageable) member.setNickname(member.displayName.replace(conf.tag.tag2, conf.tag.tag));
    member.roles.add(conf.tag.role);
    if (!channel) return;
    const embed = new MessageEmbed()
      .setAuthor(member.displayName, newUser.displayAvatarURL({ dynamic: true }))
      .setTitle("• Bir kullanıcı tag aldı!")
      .setColor("GREEN")
      .setDescription(`
${member.toString()} kullanıcısı ${conf.tag.tag} tagını aldığı için <@&${conf.tag.role}> rolü verildi.
Aktif taglı sayısı: ${guild.members.cache.filter(x => x.user.username.includes(conf.tag.tag)).size}
  `);
    channel.send(embed);
  }

  const data = await bannedTag.findOne({ guildID: guild.id });
  if (!data || !data.tags.length) return;
  if (data.tags.some((x) => !oldUser.username.includes(x.tag) && newUser.username.includes(x.tag))) {
    member.setRoles(conf.jail.roles);
    guild.channels.cache.get(conf.jail.channel).send(`${member.toString()}, sunucumuzdaki yasaklı taglardan birini aldığın için cezalıya atıldın!`);
  } else if (data.tags.some((x) => oldUser.username.includes(x.tag) && !newUser.username.includes(x.tag))) {
    member.setRoles(conf.registration.unregRoles);
  }
};

module.exports.conf = {
  name: "userUpdate",
};
