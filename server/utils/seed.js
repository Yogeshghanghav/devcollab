const Channel = require("../models/Channel");

const defaultChannels = [
  { name: "general", description: "General team discussion", isDefault: true },
  { name: "dev", description: "Development topics", isDefault: true },
  { name: "alerts", description: "System alerts and notifications", isDefault: true },
  { name: "random", description: "Off-topic conversations", isDefault: false },
];

const seedChannels = async () => {
  try {
    for (const ch of defaultChannels) {
      const existing = await Channel.findOne({ name: ch.name });
      if (!existing) {
        await Channel.create({ ...ch, type: "public", members: [] });
        console.log(` Channel #${ch.name} created`);
      }
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
};

module.exports = seedChannels;