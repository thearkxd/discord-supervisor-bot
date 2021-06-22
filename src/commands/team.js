const { teams, registration, tag } = require("../configs/config.json");
const emojis = require("../configs/emojis.json");

module.exports = {
  conf: {
    aliases: ["team"],
    name: "ekip",
    help: "ekip [ekip numarası/tüm]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: (client, message, args, embed, prefix) => {
    if (!teams || !teams.length) return message.channel.error(message, "Bu sunucuda ekip ya da ekip rolü bulunmuyor!");
    if (teams.some(x => teams.indexOf(x) + 1 === parseInt(args[0]))) {
      const team = teams.find(x => teams.indexOf(x) + 1 === parseInt(args[0]));
      embed.setDescription(`
<@&${team}> ekibinin sunucu içi durumu;

${emojis.ates} Toplam üye sayısı: \`${message.guild.members.cache.filter(x => x.roles.cache.has(team)).size}\`
${emojis.ates} Sunucumuzda yetkili olan üye sayısı: \`${message.guild.members.cache.filter(x => x.roles.cache.has(team) && registration.staffs.some(r => x.roles.cache.has(r))).size}\`
${emojis.ates} Ses kanallarında bulunan üye sayısı: \`${message.guild.members.cache.filter(x => x.roles.cache.has(team) && x.voice).size}\`
${emojis.ates} Taglı üye sayısı: \`${message.guild.members.cache.filter(x => x.roles.cache.has(team) && x.user.username.includes(tag.tag)).size}\`
      `);
      message.channel.send(embed);
    } else if (args[0] === "tüm" || args[0] === "all") {
      embed.setThumbnail(message.guild.iconURL({ dynamic: true }));
      embed.setDescription(teams.map(team => `
<@&${team}> bilgilendirme; 
• Toplam üye sayısı: ${message.guild.members.cache.filter(x => x.roles.cache.has(team)).size}
• Çevrimiçi üye sayısı: ${message.guild.members.cache.filter(x => x.roles.cache.has(team) && x.user.presence.status !== "offline").size}
• Sesteki üye sayısı: ${message.guild.members.cache.filter(x => x.roles.cache.has(team) && x.voice).size}
      `).join("\n"));
      message.channel.send(embed);
    } else {
      embed.setThumbnail(message.guild.iconURL({ dynamic: true }));
      embed.setDescription(`
• Ekiplerin sunucu içi durumlarını görmek için ekip numarasını kullanabilirsiniz.

${teams.map((x, i) => `${prefix}ekip ${i+1} - <@&${x}>`).join("\n")}

• Tüm ekiplerin durumunu görmek için: \`${prefix}ekip tüm\`
      `);
      message.channel.send(embed);
    }
  },
};
