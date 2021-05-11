module.exports = {
  conf: {
    aliases: ["cooldown"],
    name: "slowmode",
    help: "slowmode",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    const number = args[0];
    if (!number) return message.channel.error(message, "Bir sayı girmelisin!");
    if (isNaN(number)) return message.channel.error(message, "Geçerli bir sayı girmelisin!");
    if (number > 1000) return message.channel.error(message, "Sayı en fazla 100 olmalıdır!");

    message.channel.setRateLimitPerUser(args[0]);
    message.channel.send(embed.setDescription(`Kanal slowmode'u **${number} saniye** olarak ayarlandı!`));
  },
};
