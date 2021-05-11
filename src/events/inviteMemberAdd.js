const client = global.client;
const { Collection } = require("discord.js");
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const conf = require("../configs/config.json");

/**
 * @param { Client } client
 * @param { GuildMember } member
 */

module.exports = async (member) => {
  const channel = member.guild.channels.cache.get(conf.invite.channel);
  if (!channel || member.user.bot) return;

  const gi = client.invites.get(member.guild.id).clone() || new Collection().clone();
  const invites = await member.guild.fetchInvites();
  const invite = invites.find((x) => gi.has(x.code) && gi.get(x.code).uses < x.uses) || gi.find((x) => !invites.has(x.code)) || member.guild.vanityURLCode;
  client.invites.set(member.guild.id, invites);

  if (invite === member.guild.vanityURLCode) {
    const url = await member.guild.fetchVanityData();
    channel.send(`${member} katıldı! Sunucu özel url tarafından davet edildi. Toplam kullanım: **${url.uses}**`);
  }

  if (!invite.inviter) return;
  await inviteMemberSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $set: { inviter: invite.inviter.id, date: Date.now() } }, { upsert: true });
  const willAdd = { total: 1 };
  Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7 ? willAdd.fake = 1 : willAdd.regular = 1;
  
  await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: willAdd }, { upsert: true });
  const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
  const total = inviterData ? inviterData.total : 0;
  channel.send(`${member} sunucumuza katıldı. ${invite.inviter.tag} tarafından davet edildi. (**${total}** davet)`);
};

module.exports.conf = {
  name: "guildMemberAdd",
};
