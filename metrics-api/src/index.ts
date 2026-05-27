import express from "express";
import client from "./metrics";
import { youtubeSearchCounter, connectedUsersGauge } from "./metrics";

const app = express();

app.use(express.json());

app.post("/search", (req, res) => {
  youtubeSearchCounter.inc();

  res.sendStatus(200);
});

app.post("/connect", (req, res) => {
  connectedUsersGauge.inc();

  res.sendStatus(200);
});

app.post("/disconnect", (req, res) => {
  connectedUsersGauge.dec();

  res.sendStatus(200);
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, () => {
  console.log("metrics api running on :3000");
});
