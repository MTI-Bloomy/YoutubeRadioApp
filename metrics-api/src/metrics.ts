import client from "prom-client";

export const youtubeSearchCounter = new client.Counter({
  name: "youtube_search_total",
  help: "Nombre total de recherches YouTube",
});

export const connectedUsersGauge = new client.Gauge({
  name: "connected_users",
  help: "Nombre d'utilisateurs connectés",
});

client.collectDefaultMetrics();

export default client;
