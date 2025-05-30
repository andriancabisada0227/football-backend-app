import { Router } from "express";
import {
  getTrendingPlayers,
  getUserRatingInsights
} from "../controllers/analytics.controller";

const router = Router();

router.get("/trending", getTrendingPlayers);
router.get("/user/:userId/insights", getUserRatingInsights);

export default router;
