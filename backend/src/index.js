import express from "express";
import { config } from "dotenv";
import { connectDatabase, prisma } from "./config/prismaClient.js";

const app = express();
config();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend working fine" });
});

app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server running on port ${PORT}`);
});
