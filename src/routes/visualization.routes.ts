import { Router } from "express";
import {
  getMatchPlayerAverages,
  getUserRatingSummary,
} from "../controllers/visualization.controller";

const router = Router();

router.get("/match/:matchId/averages", getMatchPlayerAverages);
router.get("/user/:userId/summary", getUserRatingSummary);

export default router;
