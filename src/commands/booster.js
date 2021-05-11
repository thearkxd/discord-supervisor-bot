module.exports = {
  conf: {
    aliases: [],
    name: "booster",
    help: "booster [isim]",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */
  
  run: async (client, message, args, embed) => {
    if (!message.member.premiumSince) return message.channel.error(message, "Bu komutu kullanabilmek için boost basmış olmanız gerekmektedir!");
    if (!message.member.manageable) return message.channel.error(message, "Bu üyenin adını değiştiremiyorum!");

    const username = args.join(" ");
    if (!username) return message.channel.error(message, "Bir kullanıcı adı belirtmelisiniz!");
    if (username.length >= 32) return message.channel.error(message, "Kullanıcı adınız en fazla 32 karakter olabilir!");
    message.member.setNickname(username);
    message.channel.send(embed.setDescription(`Kullanıcı adınız başarıyla ${username} olarak değiştirildi!`));
  },
};