const client = global.client;

/**
 * @param { Client } client
 * @param { Guild } guild
 */

module.exports = async (guild) => {
  const invites = await guild.fetchInvites();
  client.invites.set(guild.id, invites);
};

module.exports.conf = {
  name: "guildCreate",
};
