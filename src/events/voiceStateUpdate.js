const voiceInfo = require("../schemas/voiceInfo");

/**
 * @param { Client } client
 * @param { VoiceState } oldState
 * @param { VoiceState } newState
 */

module.exports = async (oldState, newState) => {
  if (!oldState.channelID && newState.channelID) await voiceInfo.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
  else if (oldState.channelID && !newState.channelID) await voiceInfo.deleteOne({ userID: oldState.id });
};

module.exports.conf = {
  name: "voiceStateUpdate",
};
