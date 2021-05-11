const { red, green } = require("../configs/emojis.json");
const voice = require("../schemas/voiceInfo");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  conf: {
    aliases: [],
    name: "ses",
    help: "ses [kullanıcı]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    const channel = message.guild.channels.cache.get(args[0]);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (channel) {
      const data = await voice.find({}).sort({ date: -1 });
      message.channel.sendEmbed(embed.setDescription(`
\`${channel.name}\` adlı kanaldaki üyelerin ses bilgileri:

${channel.members.map((x) => `${x.toString()}: \`${data.find((u) => u.userID === x.user.id) ? moment.duration(Date.now() - data.find((u) => u.userID === x.user.id).date).format("H [saat], m [dakika], s [saniyedir]") : "Bulunamadı!"} seste.\``).join("\n")}
      `));
    } else {
      embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }));
      if (!member.voice.channel) return message.channel.error(message, `${red} ${member.toString()} üyesi herhangi bir ses kanalında bulunmuyor!`);

      const data = await voice.findOne({ userID: member.user.id });
      message.channel.send(embed.setDescription(`
${member.toString()} üyesi **${member.voice.channel.name}** kanalında.
**-------------**
\`Mikrofonu:\` ${member.voice.mute ? `Kapalı ${red}` : `Açık ${green}`}
\`Kulaklığı:\` ${member.voice.deaf ? `Kapalı ${red}` : `Açık ${green}`}

${data ? `${moment.duration(Date.now() - data.date).format("H [saat], m [dakika], s [saniyedir]")} seste.` : ""}
      `));
    }
  },
};
