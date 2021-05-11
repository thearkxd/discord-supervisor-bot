const roles = require("../schemas/roles");

/**
 * @param { Client } client
 * @param { GuildMember } oldMember
 * @param { GuildMember } newMember
 */

module.exports = async (oldMember, newMember) => {
  const audit = await newMember.guild.fetchAuditLogs({ type: "GUILD_MEMBER_UPDATE" });
  const entry = audit.entries.first();
  if (entry.executor.bot) return;

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    const role = oldMember.roles.cache.find((x) => !newMember.roles.cache.has(x));
    await roles.findOneAndUpdate({ guildID: newMember.guild.id, userID: newMember.user.id }, { $push: { roles: { staff: entry.executor.id, date: Date.now(), role: role.id, type: false } } }, { upsert: true });
  } else if (newMember.roles.cache.size > oldMember.roles.cache.size) {
    const role = newMember.roles.cache.find((x) => !oldMember.roles.cache.has(x));
    await roles.findOneAndUpdate({ guildID: newMember.guild.id, userID: newMember.user.id }, { $push: { roles: { staff: entry.executor.id, date: Date.now(), role: role.id, type: true } } }, { upsert: true });
  }
};

module.exports.conf = {
  name: "guildMemberUpdate",
};
