const conf = require("../configs/config.json");
const emojis = require("../configs/emojis.json");
const client = global.client;
const moment = require("moment");
moment.locale("tr");
const bannedTag = require("../schemas/bannedTag");

/**
 * @param { Client } client
 * @param { GuildMember } member
 */

module.exports = async (member) => {
  if (member.user.bot) return;
  const jailChannel = member.guild.channels.cache.get(conf.jail.channel);
  const channel = member.guild.channels.cache.get(conf.registration.channel);
  const data = await bannedTag.findOne({ guildID: member.guild.id });
  if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
    await member.setRoles(conf.jail.roles);
    jailChannel.wsend(`
${emojis.star} ${member.toString()}, sunucumuza hoşgeldin.
Fakat hesabın 1 haftadan önce açıldığı için cezalıya düştün.
Eğer kayıt olmak istiyorsan yetkililer ile iletişime geçebilirsin.
Hesabın açılma tarihi: \`${moment(member.user.createdAt).format("LLL")}\`
	  `);
    channel.wsend(`${member.toString()} üyesi sunucumuza katıldı fakat hesabı yeni olduğu için cezalandırıldı!`);
  } else if (data && data.tags.length && data.tags.some((x) => member.user.username.includes(x.tag))) {
    member.setRoles(conf.bannedTag ? conf.bannedTag.roles : conf.jail.roles);
    member.guild.channels.cache.get(conf.bannedTag ? conf.bannedTag.channel : conf.jail.channel).wsend(`
${emojis.star} ${member.toString()}, sunucumuza hoşgeldin.
${emojis.cross} Fakat kullanıcı adın sunucumuzun yasaklı taglarından birini içerdiği için cezalıya atıldın!
    `);
    channel.wsend(`${member.toString()} üyesi sunucumuza katıldı fakat kullanıcı adı sunucumuzun yasaklı taglarından birini içerdiği için cezalandırıldı!`);
  } else {
    if (member.manageable) await member.setNickname(`${conf.tag.tag2} İsim${conf.registration.brace}Yaş`);
    await member.roles.add(conf.registration.unregRoles);
    channel.wsend(`
Sunucumuza hoş geldin, ${member.toString()}! Hesabın ${moment(member.user.createdAt).format("LLL")} tarihinde \`(${moment(member.user.createdTimestamp).fromNow()})\` oluşturulmuş.

Kayıt olmak için "Confirmed" odalarında <@&${conf.registration.staffs[0]}> rolü olan bir yetkiliye sesli teyit vermen gerekmektedir.
${member.guild.rulesChannelID ? `${member.guild.rulesChannel.toString()} kanalından sunucu kurallarımızı okumayı unutma!` : "Sunucu kurallarımızı okumayı unutma!"}

Seninle beraber ${client.numEmoji(member.guild.memberCount)} kişiyiz. :tada::tada::tada:
    `);
  }
  if (member.user.username.includes(conf.tag.tag)) member.roles.add(conf.tag.role);
};

module.exports.conf = {
  name: "guildMemberAdd",
};
