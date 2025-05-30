import { Router } from "express";
import {
  getTopRatedPlayers,
  getMostActiveRaters
} from "../controllers/leaderboard.controller";

const router = Router();

router.get("/players", getTopRatedPlayers);
router.get("/raters", getMostActiveRaters);

export default router;
