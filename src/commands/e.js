const conf = require("../configs/config.json");
const isimler = require("../schemas/names");
const regstats = require("../schemas/registerStats");

module.exports = {
  conf: {
    aliases: ["erkek", "man", "m"],
    name: "e",
    help: "e [kullanıcı] [isim] [yaş]",
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
    if (!conf.registration.unregRoles.some((x) => member.roles.cache.has(x))) return message.channel.error(message, "Bu üyede kayıtsız rolü bulunmuyor!");
    if (conf.taglıAlım && (!member.user.username.includes(conf.tag.tag) && !member.premiumSince)) return message.channel.error(message, "Bu üye taglı olmadığı veya boost basmadığı için kayıt edemezsiniz!");
    const name = args.slice(1).filter((x) => isNaN(x)).map((x) => x.charAt(0).replace(/i/g, "İ").toUpperCase() + x.slice(1)).join(" ");
    const age = args.filter((x) => !isNaN(x) && member.id !== x)[0] || undefined;
    if (!name) return message.channel.error(message, "Geçerli bir isim belirtmelisin!");
    if (!age) return message.channel.error(message, "Geçerli bir yaş belirtmelisin!");
    if (name.length + age.length >= 30) return message.channel.error(message, "İsim ve yaşın uzunluğu 30 karakteri geçtiği için kayıt edemiyorum!");
    if (!member.manageable) return message.channel.error(message, "Bu kişinin yetkisi benden yüksek!");

    if (member.user.username.includes(conf.tag.tag)) {
      await member.setNickname(`${conf.tag.tag} ${name}${conf.registration.brace}${age}`);
      if (!member.roles.cache.has(conf.tag.role)) await member.roles.add(conf.tag.role);
    } else {
      await member.setNickname(`${conf.tag.tag2} ${name}${conf.registration.brace}${age}`);
      if (member.roles.cache.has(conf.tag.role)) await member.roles.remove(conf.tag.role);
    }

    await member.roles.add(conf.registration.manRoles);
    await member.roles.remove(conf.registration.unregRoles);

    const data = await isimler.findOne({ guildID: message.guild.id, userID: member.user.id });

    embed.setAuthor(member.displayName, member.user.displayAvatarURL({ dynamic: true }));
    embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }));
    embed.setColor("#c0d2ff");
    embed.setDescription(`
${member.toString()} üyesi, ${conf.registration.manRoles.length > 1 ? conf.registration.manRoles.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + conf.registration.manRoles.map(x => `<@&${x}>`).slice(-1) : conf.registration.manRoles.map(x => `<@&${x}>`).join("")} rolleri verilerek kayıt edildi! 

${data ? data.names.splice(0, 10).map((x, i) => `\`${i + 1}.\` \`${x.name}\` (${x.rol})`).join("\n") : ""}
    `);
    message.channel.send(embed);

    await regstats.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { top: 1, topGuild24: 1, topGuild7: 1, top24: 1, top7: 1, top14: 1, erkek: 1, erkek24: 1, erkek7: 1, erkek14: 1, }, }, { upsert: true });
    message.guild.channels.cache.get(conf.chat).send(`${member.toString()} aramıza katıldı!`);
    message.member.updateTask(message.guild.id, "kayıt", 1, message.channel);
  },
};
