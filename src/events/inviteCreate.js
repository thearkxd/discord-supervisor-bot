const client = global.client;

/**
 * @param { Client } client
 * @param { Invite } invite
 */

module.exports = async (invite) => {
  const gi = client.invites.get(invite.guild.id);
  gi.set(invite.code, invite);
  client.invites.set(invite.guild.id, gi);
};

module.exports.conf = {
  name: "inviteCreate",
};
