import client from "prom-client";

export const youtubeSearchCounter = new client.Counter({
  name: "youtube_search_total",
  help: "Nombre total de recherches YouTube",
});

client.collectDefaultMetrics();

export default client;
