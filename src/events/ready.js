const CronJob = require("cron").CronJob;
const client = global.client;
const regstats = require("../schemas/registerStats");

/**
 * @param { Client } client
 */

module.exports = async () => {
  const daily = new CronJob("0 0 * * *", () => client.guilds.cache.forEach(async (guild) => await regstats.findOneAndUpdate({ guildID: guild.id }, { $set: { topGuild24: 0, top24: 0, erkek24: 0, kız24: 0 } })), null, true, "Europe/Istanbul");
  daily.start();
  const weekly = new CronJob("0 0 * * 0", () => client.guilds.cache.forEach(async (guild) => await regstats.findOneAndUpdate({ guildID: guild.id }, { $set: { topGuild7: 0, top7: 0, erkek7: 0, kız7: 0 } })), null, true, "Europe/Istanbul");
  weekly.start();
  const twoWeekly = new CronJob("0 0 1,15 * *", () => client.guilds.cache.forEach(async (guild) => await regstats.findOneAndUpdate({ guildID: guild.id }, { $set: { top14: 0, erkek14: 0, kız14: 0 } })), null, true, "Europe/Istanbul");
  twoWeekly.start();

  client.guilds.cache.forEach(async (guild) => {
    const invites = await guild.fetchInvites();
    client.invites.set(guild.id, invites);
  });
};

module.exports.conf = {
  name: "ready",
};