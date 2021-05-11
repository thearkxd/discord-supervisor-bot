const conf = require("../configs/config.json");
const { crown } = require("../configs/emojis.json");

/**
 * @param { Client } client
 * @param { Message } message
 */

module.exports = async (message) => {
  if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
    await message.react(crown);
    message.channel.send(conf.tag.tag);
  }
};

module.exports.conf = {
  name: "message"
};
