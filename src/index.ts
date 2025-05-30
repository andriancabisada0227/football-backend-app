import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes";
import matchRoutes from "./routes/match.routes";
import visualizationRoutes from "./routes/visualization.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import pollRoutes from "./routes/poll.routes";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());


app.use("/api/polls", pollRoutes);
app.use("/api/visuals", visualizationRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);


app.listen(3000, () => console.log("Server running on port 3000"));