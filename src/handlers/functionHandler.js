const { GuildMember, TextChannel, MessageEmbed, Guild } = require("discord.js");
const { numEmojis } = require("../configs/emojis.json");
const conf = require("../configs/config.json");
const penals = require("../schemas/penals");

/**
 * @param { Client } client
 */

module.exports = async (client) => {
  client.numEmoji = (num) => num.toString().split("").map((x) => numEmojis[x] || x).join("");
  client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  GuildMember.prototype.setRoles = async function (roles) {
    if (!this.manageable) return;
    const newRoles = this.roles.cache.filter(x => x.managed).map(x => x.id).concat(roles);
    return this.roles.set(newRoles).catch(() => {});
  };

  TextChannel.prototype.sendEmbed = function (embed) {
    if (!embed || !embed.description) return;
    const text = embed.description;
    for (var i = 0; i < Math.floor(text.length / 2048) + 1; i++) {
      this.send(embed.setDescription(text.slice(i * 2048, (i + 1) * 2048)));
    }
  };

  TextChannel.prototype.wsend = async function (message) {
    const hooks = await this.fetchWebhooks();
    let webhook = hooks.find(a => a.name === client.user.username && a.owner.id === client.user.id);
    if (webhook) return webhook.send(message);
    webhook = await this.createWebhook(client.user.username, { avatar: client.user.avatarURL() });
    return webhook.send(message);
  };

  TextChannel.prototype.error = async function (message, text) {
    const theark = await client.users.fetch("350976460313329665");
    const embed = new MessageEmbed()
      .setColor("RED")
      .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 }))
      .setFooter("Developed by Theark", theark.avatarURL({ dynamic: true }));
    this.send(embed.setDescription(text)).then((x) => { if (x.deletable) x.delete({ timeout: 10000 }); });
  };
  
  Guild.prototype.checkTaggeds = async function () {
    this.members.cache.forEach((x) => {
      if (x.user.bot || !x.manageable) return;
      if (conf.taglıAlım && !x.user.username.includes(conf.tag.tag) && !conf.registration.unregRoles.some((r) => x.roles.cache.has(r)) && !conf.jail.roles.some((r) => x.roles.cache.has(r))) {
        x.setRoles(conf.registration.unregRoles);
        if (x.nickname && x.nickname.includes(conf.tag.tag)) x.setNickname(x.nickname.replace(conf.tag.tag, conf.tag.tag2)).catch(() => {});
      } else if (!x.user.username.includes(conf.tag.tag) && x.roles.cache.has(conf.tag.role)) {
        x.roles.remove(conf.tag.role);
        if (x.nickname && x.nickname.includes(conf.tag.tag)) x.setNickname(x.nickname.replace(conf.tag.tag, conf.tag.tag2)).catch(() => {});
      } else if (x.user.username.includes(conf.tag.tag) && !x.roles.cache.has(conf.tag.role)) {
        x.roles.add(conf.tag.role);
        if (x.nickname && x.nickname.includes(conf.tag.tag2)) x.setNickname(x.nickname.replace(conf.tag.tag2, conf.tag.tag)).catch(() => {});
      }
    });
  };

  client.penalize = async (guildID, userID, type, active = true, staff, reason, temp = false, finishDate = undefined) => {
    const id = await penals.find({ guildID });
    return await new penals({ id: id ? id.length + 1 : 1, userID, guildID, type, active, staff, reason, temp, finishDate }).save();
  };

  Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
  };
};
