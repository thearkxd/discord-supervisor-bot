const { Schema, model } = require("mongoose");

const schema = Schema({
	guildID: { type: String, default: "" },
	tags: { type: Array, default: [] }
});

module.exports = model("bannedTag", schema);