const { Database } = require("ark.db");
const db = new Database("/src/configs/emojis.json");

module.exports = {
  conf: {
    aliases: [],
    name: "emojikur",
    owner: true,
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message) => {
    const emojis = [
      { name: "ates", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439806018879488/ates.gif" },
      { name: "tacc", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439808544243762/tacc.gif" },
      { name: "sonsuzkalp", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439863346364436/sonsuzkalp.gif" },
      { name: "star", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439871505072178/star.gif" },
      { name: "red", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439875170500629/red.gif" },
      { name: "green", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439878664486913/green.gif" },
      { name: "coin", url: "https://cdn.discordapp.com/attachments/827439712834158622/861702995371884634/coin.gif" }
    ];

    const numEmojis = [
      { name: "0emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439854140915753/0emoji.gif" },
      { name: "1emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439866211074068/1emoji.gif" },
      { name: "2emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439821433470976/2emoji.gif" },
      { name: "3emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439820543492116/3emoji.gif" },
      { name: "4emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439817650208810/4emoji.gif" },
      { name: "5emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439816425603122/5emoji.gif" },
      { name: "6emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439814600425502/6emoji.gif" },
      { name: "7emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439814047039508/7emoji.gif" },
      { name: "8emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439812796612618/8emoji.gif" },
      { name: "9emoji", url: "https://cdn.discordapp.com/attachments/827439712834158622/827439809391362058/9emoji.gif" }
    ];

    emojis.forEach(async (x) => {
      if (message.guild.emojis.cache.find((e) => x.name === e.name)) return db.set(x.name, message.guild.emojis.cache.find((e) => x.name === e.name).toString());
      const emoji = await message.guild.emojis.create(x.url, x.name);
      await db.set(x.name, emoji.toString());
      message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
    });

    numEmojis.forEach(async (x) => {
      if (message.guild.emojis.cache.find((e) => x.name === e.name)) return db.set(x.name, message.guild.emojis.cache.find((e) => x.name === e.name).toString());
      const emoji = await message.guild.emojis.create(x.url, x.name);
      await db.set(`numEmojis.${emoji.name.slice(0, 1)}`, emoji.toString());
      message.channel.send(`\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})`);
    });
  },
};
