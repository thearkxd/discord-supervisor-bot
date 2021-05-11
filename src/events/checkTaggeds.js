const conf = require("../configs/config.json");
const client = global.client;

/**
 * @param { Client } client
 */

module.exports = async () => {
  setInterval(() => {
    const guild = client.guilds.cache.get(conf.guildID);
    if (!guild) return;
    guild.checkTaggeds();
  }, 5000);
};

module.exports.conf = {
  name: "ready",
};
