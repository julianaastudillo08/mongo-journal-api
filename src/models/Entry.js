const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, maxlength: 5000 },
    mood: {
      type: String,
      enum: ["great", "good", "ok", "low", "rough"],
      default: "ok",
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

entrySchema.index({ mood: 1, createdAt: -1 });
entrySchema.index({ tags: 1 });

module.exports = mongoose.model("Entry", entrySchema);
