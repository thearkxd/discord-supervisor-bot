const { MessageEmbed } = require("discord.js");

module.exports = {
  conf: {
    aliases: [],
    name: "avatar",
    help: "avatar",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */
  
  run: async (client, message, args) => {
    const user = args[0] ? message.mentions.users.first() || await client.users.fetch(args[0]) : message.author;
    const gif = user.displayAvatarURL({ dynamic: true }).endsWith(".gif") ? ` | [GIF](${user.displayAvatarURL({ format: "gif" })})` : "";

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(user.username)
      .setDescription(`**[WEBP](${user.displayAvatarURL({ format: "webp", })}) | [JPEG](${user.displayAvatarURL({ format: "jpeg", })}) | [PNG](${user.displayAvatarURL({ format: "png" })}) ${gif}**`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }));
    message.channel.send(embed);
  },
};