const client = global.client;

/**
 * @param { Client } client
 * @param { Invite } invite
 */

module.exports = async (invite) => {
  const gi = client.invites.get(invite.guild.id);
  gi.delete(invite.code);
  client.invites.delete(invite.guild.id, gi);
};

module.exports.conf = {
  name: "inviteDelete",
};
