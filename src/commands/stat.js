const regstats = require("../schemas/registerStats");
const conf = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: ["stats"],
    name: "stat",
    help: "stat",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!conf.registration.staffs.some((x) => message.member.roles.cache.has(x)) && !message.member.hasPermission(8)) return message.channel.error(message, "Üzgünüm, kayıt yetkin bulunmuyor!");

    if (args[0] === "top") {
      let registerTop = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

      if (!registerTop.length) return message.channel.error(message, "Herhangi bir kayıt verisi bulunamadı!");
      registerTop = registerTop.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 10);
      message.channel.send(embed.setDescription(registerTop.map((x, i) => `\`${i + 1}.\` <@${x.userID}> Toplam **${x.top}** (\`${x.erkek} Erkek, ${x.kız} Kız\`)`)));
    } else if (!args[0]) {
      const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
      message.channel.send(embed.setDescription(`
    24 saatlik toplam kayıt bilgisi: \`${data ? data.top24 : 0}\`
    24 saatlik erkek kayıt bilgisi: \`${data ? data.erkek24 : 0}\`
    24 saatlik kız kayıt bilgisi: \`${data ? data.kız24 : 0}\`
  
    1 haftalık toplam kayıt bilgisi: \`${data ? data.top7 : 0}\`
    1 haftalık erkek kayıt bilgisi: \`${data ? data.erkek7 : 0}\`
    1 haftalık kız kayıt bilgisi: \`${data ? data.kız7 : 0}\`
  
    2 haftalık toplam kayıt bilgisi: \`${data ? data.top14 : 0}\`
    2 haftalık toplam kayıt erkek bilgisi: \`${data ? data.erkek14 : 0}\`
    2 haftalık toplam kayıt kız bilgisi: \`${data ? data.kız14 : 0}\`
  
    Toplam kayıt bilgisi: \`${data ? data.top : 0}\`
    Toplam erkek kayıt bilgisi: \`${data ? data.erkek : 0}\`
    Toplam kız kayıt bilgisi: \`${data ? data.kız : 0}\`
	`));
    }
  },
};
