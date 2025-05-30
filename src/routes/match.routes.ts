import { Router } from "express";
import {
  createMatch,
  getAllMatches,
  addPlayersToMatch,
  getPlayersForMatch
} from "../controllers/match.controller";

const router = Router();

router.post("/", createMatch);
router.get("/", getAllMatches);
router.post("/:matchId/players", addPlayersToMatch);
router.get("/:matchId/players", getPlayersForMatch);

export default router;
