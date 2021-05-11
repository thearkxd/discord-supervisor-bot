const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  name: { type: String, default: "" },
  canUses: { type: Array, default: undefined },
  roles: { type: Array, default: undefined },
});

module.exports = model("perms", schema);
