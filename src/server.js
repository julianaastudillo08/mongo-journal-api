const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { z } = require("zod");
const Entry = require("./models/Entry");

const app = express();
const PORT = process.env.PORT || 4120;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/journal";

app.use(cors());
app.use(express.json());

const createSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(5000),
  mood: z.enum(["great", "good", "ok", "low", "rough"]).optional(),
  tags: z.array(z.string()).optional(),
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "mongo-journal-api",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/entries", async (req, res) => {
  const filter = {};
  if (req.query.mood) filter.mood = req.query.mood;
  if (req.query.tag) filter.tags = req.query.tag;
  const rows = await Entry.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json(rows);
});

app.post("/entries", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const row = await Entry.create(parsed.data);
  res.status(201).json(row);
});

app.get("/entries/:id", async (req, res) => {
  const row = await Entry.findById(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

app.delete("/entries/:id", async (req, res) => {
  const row = await Entry.findByIdAndDelete(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

app.get("/stats", async (_req, res) => {
  const byMood = await Entry.aggregate([
    { $group: { _id: "$mood", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const total = await Entry.countDocuments();
  res.json({ total, byMood });
});

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected");
  app.listen(PORT, () => console.log(`mongo-journal-api on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
