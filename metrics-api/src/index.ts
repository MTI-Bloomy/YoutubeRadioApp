import express from "express";
import client from "./metrics";
import { youtubeSearchCounter } from "./metrics";

const app = express();

app.use(express.json());

app.post("/search", (req, res) => {
  youtubeSearchCounter.inc();

  console.log("search metric received");

  res.sendStatus(200);
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, () => {
  console.log("metrics api running on :3000");
});
