import express from "express";
import { config } from "dotenv";
import { connectDatabase, prisma } from "./config/prismaClient.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import job from "./config/cron.js";

config();
const app = express();

if (process.env.NODE_ENV === "production") job.start();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend working fine" });
});

app.listen(PORT, async () => {
  await connectDatabase();
  console.log(`Server running on port ${PORT}`);
});
