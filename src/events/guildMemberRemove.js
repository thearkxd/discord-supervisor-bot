const data = require("../schemas/names");
const inviteMemberSchema = require("../schemas/inviteMember");
const inviterSchema = require("../schemas/inviter");
const conf = require("../configs/config.json");
const client = global.client;

/**
 * @param { Client } client
 * @param { GuildMember } member
 */

module.exports = async (member) => {
  const channel = member.guild.channels.cache.get(conf.invite.channel);
  if (!channel || member.user.bot) return;

  await data.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $push: { names: { name: member.displayName, rol: "Sunucudan Ayrılma", date: Date.now() } } }, { upsert: true });

  const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
  if (!inviteMemberData) channel.send(`\`${member.user.tag}\` sunucumuzdan ayrıldı ama kim tarafından davet edildiğini bulamadım.`);
  else {
    const inviter = await client.users.fetch(inviteMemberData.inviter);
    await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
    const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
    const total = inviterData ? inviterData.total : 0;
    channel.send(`\`${member.user.tag}\` sunucumuzdan ayrıldı. ${inviter.tag} tarafından davet edilmişti. (**${total}** davet)`);
  }
};

module.exports.conf = {
  name: "guildMemberRemove",
};
