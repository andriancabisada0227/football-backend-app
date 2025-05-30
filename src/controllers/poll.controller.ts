import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new poll
export const createPoll = async (req: Request, res: Response) => {
  const { matchId, question, options } = req.body;

  try {
    const poll = await prisma.poll.create({
      data: {
        matchId,
        question,
        options,
      },
    });

    res.status(201).json(poll);
  } catch {
    res.status(400).json({ error: "Failed to create poll" });
  }
};

// Vote on a poll
export const votePoll = async (req: Request, res: Response) => {
  const { pollId } = req.params;
  const { userId, option } = req.body;

  try {
    // Optional: prevent duplicate vote from same user
    if (userId) {
      const existing = await prisma.pollVote.findFirst({
        where: { pollId, userId },
      });

      if (existing) {
        return res.status(400).json({ error: "Already voted" });
      }
    }

    const vote = await prisma.pollVote.create({
      data: { pollId, option, userId },
    });

    res.status(201).json(vote);
  } catch {
    res.status(400).json({ error: "Failed to vote" });
  }
};

// Get results for a poll
export const getPollResults = async (req: Request, res: Response) => {
  const { pollId } = req.params;

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { votes: true },
  });

  if (!poll) return res.status(404).json({ error: "Poll not found" });

  const results = poll.options.map((option) => ({
    option,
    count: poll.votes.filter((v) => v.option === option).length,
  }));

  res.json({
    question: poll.question,
    results,
  });
};

// Get all polls for a match
export const getMatchPolls = async (req: Request, res: Response) => {
  const { matchId } = req.params;

  const polls = await prisma.poll.findMany({
    where: { matchId },
    include: { votes: true },
  });

  const formatted = polls.map((p) => ({
    id: p.id,
    question: p.question,
    options: p.options,
    totalVotes: p.votes.length,
  }));

  res.json(formatted);
};
