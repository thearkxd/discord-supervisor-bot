const perms = require("../schemas/perms");
const conf = require("../configs/config.json");

module.exports = {
    conf: {
      aliases: ["perm"],
      name: "yetki",
      help: "yetki [ekle/sil/düzenle/liste/bilgi/ver/al]",
    },
  
    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */
  
    run: async (client, message, args, embed, prefix) => {
      if (["ekle", "add", "oluştur"].includes(args[0])) {
        if (message.guild.owner.id !== message.author.id) return message.channel.error(message, "Yetki eklemek için yeterli yetkin bulunmuyor!");
        const name = args[1];
        if (!name) return message.channel.error(message, "Bir yetki ismi belirtmelisin!");
        const data = await perms.findOne({ guildID: message.guild.id, name });
        if (data) return message.channel.error(message, `${name} isimli bir yetki zaten bulunuyor!`);
        new perms({ guildID: message.guild.id, name }).save();
        message.channel.send(embed.setDescription(`
    ${name} isimli bir yetki oluşturuldu!
    \`${prefix}yetki düzenle ${name}\` komutu ile verilecek rolleri ve kullanabilecek kişileri ayarlamayı unutmayın!
        `));
      } else if (["düzenle", "edit"].includes(args[0])) {
        if (message.guild.owner.id !== message.author.id) return message.channel.error(message, "Yetki eklemek için yeterli yetkin bulunmuyor!");
        const name = args[1];
        if (!name) return message.channel.error(message, "Bir yetki ismi belirtmelisin!");
        const data = await perms.findOne({ guildID: message.guild.id, name });
        if (!data) return message.channel.error(message, `${name} isimli bir yetki bulunamadı!`);
        if (args[2] === "roller") {
          const roles = message.mentions.roles.map((x) => x.id);
          if (!roles.length) return message.channel.error(message, "Bir rol belirtmelisin!");
          data.roles = roles;
          await data.save();
          message.channel.send(embed.setDescription(`
          \`${name}\` yetkisinde verilecek roller ${roles.length > 1 ? roles.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + roles.map(x => `<@&${x}>`).slice(-1) : roles.map(x => `<@&${x}>`).join("")} olarak ayarlandı!
          `));
        } else if (args[2] === "kullanabilecekler") {
          const roles = message.mentions.roles.map((x) => x.id);
          if (!roles.length) return message.channel.error(message, "Bir rol belirtmelisin!");
          data.canUses = roles;
          await data.save();
          message.channel.send(embed.setDescription(`
          \`${name}\` yetkisini verebilecek roller ${roles.length > 1 ? roles.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + roles.map(x => `<@&${x}>`).slice(-1) : roles.map(x => `<@&${x}>`).join("")} olarak ayarlandı!
          `));
        } else return message.channel.error(message, "`roller` ya da `kullanabilecekler` argümanlarını kullanmalısın!");
      } else if (["sil", "delete"].includes(args[0])) {
        if (message.guild.owner.id !== message.author.id) return message.channel.error(message, "Yetki eklemek için yeterli yetkin bulunmuyor!");
        const name = args[1];
        if (!name) return message.channel.error(message, "Bir yetki ismi belirtmelisin!");
        const data = await perms.findOne({ guildID: message.guild.id, name });
        if (!data) return message.channel.error(message, `${name} isimli bir yetki bulunamadı!`);
        await perms.deleteOne({ guildID: message.guild.id, name });
        message.channel.send(embed.setDescription(`\`${name}\` isimli yetki başarıyla silindi!`));
      } else if (["ver", "give"].includes(args[0])) {
        const name = args[1];
        if (!name) return message.channel.error(message, "Bir yetki ismi belirtmelisin!");
        const data = await perms.findOne({ guildID: message.guild.id, name });
        if (!data) return message.channel.error(message, `${name} isimli bir yetki bulunamadı!`);
        if (!data.roles) return message.channel.error(message, `\`${name}\` isimli yetkinin verilecek rolleri ayarlanmamış!`);
        if (!data.canUses) return message.channel.error(message, `\`${name}\` isimli yetkiyi verebilecek roller ayarlanmamış!`);
        if (!data.canUses.some((x) => message.member.roles.cache.has(x)) && !message.member.hasPermission(8)) return message.channel.error(message, "Bu komutu kullanabilecek yetkide değilsin!");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
        if (!member) return message.channel.error(message, "Bir üye belirtmelisin!");
        if (data.roles.every((x) => member.roles.cache.has(x))) return message.channel.error(message, `${member.toString()} üyesi zaten \`${name}\` isimli yetkinin rollerine sahip!`);
        member.roles.add(data.roles);
        message.channel.send(embed.setDescription(`${member.toString()} üyesine ${data.roles.length > 1 ? data.roles.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + data.roles.map(x => `<@&${x}>`).slice(-1) : data.roles.map(x => `<@&${x}>`).join("")} rolü verildi!`));
      } else if (["al", "get"].includes(args[0])) {
        const name = args[1];
        if (!name) return message.channel.error(message, "Bir yetki ismi belirtmelisin!");
        const data = await perms.findOne({ guildID: message.guild.id, name });
        if (!data) return message.channel.error(message, `${name} isimli bir yetki bulunamadı!`);
        if (!data.roles) return message.channel.error(message, `\`${name}\` isimli yetkinin verilecek rolleri ayarlanmamış!`);
        if (!data.canUses) return message.channel.error(message, `\`${name}\` isimli yetkiyi verebilecek roller ayarlanmamış!`);
        if (!data.canUses.some((x) => message.member.roles.cache.has(x)) && !message.member.hasPermission(8)) return message.channel.error(message, "Bu komutu kullanabilecek yetkide değilsin!");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
        if (!member) return message.channel.error(message, "Bir üye belirtmelisin!");
        if (!data.roles.every((x) => member.roles.cache.has(x))) return message.channel.error(message, `${member.toString()} üyesi \`${name}\` isimli yetkinin rollerine sahip değil!`);
        member.roles.remove(data.roles);
        message.channel.send(embed.setDescription(`${member.toString()} üyesinden ${data.roles.length > 1 ? data.roles.slice(0, -1).map(x => `<@&${x}>`).join(", ") + " ve " + data.roles.map(x => `<@&${x}>`).slice(-1) : data.roles.map(x => `<@&${x}>`).join("")} rolü alındı!`));
      } else if (["liste", "list"].includes(args[0])) {
        if (!conf.registration.staffs.some((x) => message.member.roles.cache.has(x))) return message.channel.error(message, "Yeterli yetkin bulunmuyor!");
        let data = await perms.find({ guildID: message.guild.id });
        if (!data.length) return message.channel.error(message, "Bu sunucuda yetki eklenmemiş!");
        data = data.map((x, i) => `\`${i+1}.\` Yetki ismi: \`${x.name}\`, Verilecek roller: ${x.roles ? x.roles.map((r) => `<@&${r}>`).join(", ") : "Bulunmuyor!"}, Kullanabilecek roller: ${x.canUses ? x.canUses.map((r) => `<@&${r}>`).join(", ") : "Bulunmuyor!"}`).join("\n");
        for (var i = 0; i < Math.floor(data.length / 2000); i++) {
          message.channel.send(embed.setDescription(data.slice(0, 2000)));
          data = data.slice(2000);
        }
        if (data.length > 0) message.channel.send(embed.setDescription(data));
      } else if (["bilgi", "info"].includes(args[0])) {
        if (!conf.registration.staffs.some((x) => message.member.roles.cache.has(x))) return message.channel.error(message, "Yeterli yetkin bulunmuyor!");
        const name = args[1];
        if (!name) return message.channel.error(message, "Bir yetki ismi belirtmelisin!");
        const data = await perms.findOne({ guildID: message.guild.id, name });
        if (!data) return message.channel.error(message, `${name} isimli bir yetki bulunamadı!`);
        message.channel.send(embed.setDescription(`Yetki ismi: \`${data.name}\`, Verilecek roller: ${data.roles ? data.roles.map((r) => `<@&${r}>`).join(", ") : "Bulunmuyor!"}, Kullanabilecek roller: ${data.canUses ? data.canUses.map((r) => `<@&${r}>`).join(", ") : "Bulunmuyor!"}`));
      } else return message.channel.error(message, "`ekle`, `sil`, `düzenle`, `liste`, `bilgi`, `ver` ya da `al` argümanlarından birini kullanmalısın!");
    },
  };
  