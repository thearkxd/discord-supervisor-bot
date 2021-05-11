const conf = require("../configs/config.json");
const settings = require("../configs/settings.json");

module.exports = {
  conf: {
    aliases: [],
    name: "ysay",
    help: "ysay",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
    const filtered = message.guild.members.cache.filter((x) => (conf.registration.staffs.some((r) => x.roles.cache.has(r)) || x.hasPermission(8)) && x.user.presence.status !== "offline" && !x.user.bot && !x.voice.channelID && !settings.owners.includes(x.user.id)).array();
    if (filtered.length === 0) return message.channel.send("Aktif olup seste olmayan yetkili bulunmuyor!");

    message.channel.send(`
Aktif olup seste olmayan yetkili sayısı: ${filtered.length} 
${filtered.map((x) => x.toString()).join(", ")}
    `);
  },
};
