const { GuildMember, TextChannel, MessageEmbed, Guild } = require("discord.js");
const { numEmojis, coin: coinEmoji } = require("../configs/emojis.json");
const conf = require("../configs/config.json");
const penals = require("../schemas/penals");
const task = require("../schemas/task");
const coin = require("../schemas/coin");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
  /**
   * @param {Number} num
   * @returns {String}
   */
  client.numEmoji = (num) => num.toString().split("").map((x) => numEmojis[x] || x).join("");

  /**
   * @param {Number} ms
   * @returns {Promise<unknown>}
   */
  client.wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * @param {String|Array} roles
   * @returns {Promise<any>}
   */
  GuildMember.prototype.setRoles = async function (roles) {
    if (!this.manageable) return;
    const newRoles = this.roles.cache.filter(x => x.managed).map(x => x.id).concat(roles);
    return this.roles.set(newRoles).catch(() => {});
  };

  /**
   * @param {String} guildID
   * @param {String} type
   * @param {Number} data
   * @param {TextChannel|VoiceChannel} channel
   * @returns {Promise<void>}
   */
  GuildMember.prototype.updateTask = async function (guildID, type, data, channel = null) {
    const taskData = await task.find({ guildID, userID: this.user.id, type, active: true });
    taskData.forEach(async (x) => {
      if (channel && x.channels && x.channels.some((x) => x !== channel.id)) return;
      x.completedCount += data;
      if (x.completedCount >= x.count) {
        x.active = false;
        x.completed = true;
        await coin.findOneAndUpdate({ guildID, userID: this.user.id }, { $inc: { coin: x.prizeCount } });

        const embed = new MessageEmbed().setColor(this.displayHexColor).setAuthor(this.displayName, this.user.avatarURL({ dynamic: true, size: 2048 })).setThumbnail("https://img.itch.zone/aW1nLzIzNzE5MzEuZ2lm/original/GcEpW9.gif");
        if (channel && channel.type === "text") channel.send(embed.setDescription(`
				${this.toString()} Tebrikler! ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} görevini başarıyla tamamladın.
				
				${x.message}
				${coinEmoji} \`${x.prizeCount} coin kazandın!\`
				`));
      }
      await x.save();
    });
  };

  /**
   * @param {MessageEmbed} embed
   */
  TextChannel.prototype.sendEmbed = function (embed) {
    if (!embed || !embed.description) return;
    const text = embed.description;
    for (var i = 0; i < Math.floor(text.length / 2048) + 1; i++) {
      this.send(embed.setDescription(text.slice(i * 2048, (i + 1) * 2048)));
    }
  };

  /**
   * @param {Message} message
   * @returns {Promise<Message>}
   */
  TextChannel.prototype.wsend = async function (message) {
    const hooks = await this.fetchWebhooks();
    let webhook = hooks.find(a => a.name === client.user.username && a.owner.id === client.user.id);
    if (webhook) return webhook.send(message);
    webhook = await this.createWebhook(client.user.username, { avatar: client.user.avatarURL() });
    return webhook.send(message);
  };

  /**
   * @param {Message} message
   * @param {String} text
   * @returns {Promise<void>}
   */
  TextChannel.prototype.error = async function (message, text) {
    const theark = await client.users.fetch("350976460313329665");
    const embed = new MessageEmbed()
      .setColor("RED")
      .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, size: 2048 }))
      .setFooter("Developed by Theark", theark.avatarURL({ dynamic: true }));
    this.send(embed.setDescription(text)).then((x) => { if (x.deletable) x.delete({ timeout: 10000 }); });
  };

  /**
   * @returns {Promise<void>}
   */
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

  /**
   * @param {String} guildID
   * @param {String} userID
   * @param {String} type
   * @param {Boolean} active
   * @param {String} staff
   * @param {String} reason
   * @param {Boolean} temp
   * @param {Number} finishDate
   * @returns {Promise<Document<any, any>>}
   */
  client.penalize = async (guildID, userID, type, active = true, staff, reason, temp = false, finishDate = undefined) => {
    const id = await penals.find({ guildID });
    return await new penals({ id: id ? id.length + 1 : 1, userID, guildID, type, active, staff, reason, temp, finishDate }).save();
  };

  /**
   * @returns {any}
   */
  Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
  };
};
