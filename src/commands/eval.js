module.exports = {
  conf: {
    aliases: [],
    name: "eval",
    owner: true
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args) => {
    if (!args[0]) return;
    const code = args.join(" ");

    try {
      var result = clean(await eval(code));
      if (result.includes(client.token))
        return message.channel.send("Kancık seni .d");
      message.channel.send(result, { code: "js", split: true });
    } catch (err) {
      message.channel.send(err, { code: "js", split: true });
    }
  },
};

function clean(text) {
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 0 });
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
  return text;
}
