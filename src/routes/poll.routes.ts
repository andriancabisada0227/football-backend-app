import { Router } from "express";
import {
  createPoll,
  votePoll,
  getPollResults,
  getMatchPolls
} from "../controllers/poll.controller";

const router = Router();

router.post("/", createPoll);
router.post("/:pollId/vote", votePoll);
router.get("/:pollId/results", getPollResults);
router.get("/match/:matchId", getMatchPolls);

export default router;
