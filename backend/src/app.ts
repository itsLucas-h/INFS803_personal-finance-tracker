import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("🚀 App deployed successfully from GitHub Actions to EC2!");
});

app.get("/health", (_, res) => {
  res.send("OK");
});

export default app;
