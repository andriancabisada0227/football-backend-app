import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Average player ratings in a match
export const getMatchPlayerAverages = async (req: Request, res: Response) => {
  const { matchId } = req.params;

  const results = await prisma.rating.groupBy({
    by: ["playerId"],
    where: { matchId },
    _avg: { score: true },
    _count: true,
  });

  const players = await prisma.player.findMany({
    where: { matchId },
  });

  const combined = results.map((rating) => {
    const player = players.find((p) => p.id === rating.playerId);
    return {
      playerId: rating.playerId,
      name: player?.name,
      team: player?.team,
      avgScore: rating._avg.score,
      votes: rating._count,
    };
  });

  res.json(combined);
};

// 2. User's rating trends
export const getUserRatingSummary = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const ratings = await prisma.rating.findMany({
    where: { userId },
    include: { player: true },
  });

  const byPlayer = ratings.reduce((acc: any, r) => {
    const key = r.player.name;
    acc[key] = acc[key] || [];
    acc[key].push(r.score);
    return acc;
  }, {});

  const summary = Object.entries(byPlayer).map(([name, scores]: any) => ({
    player: name,
    avg: (
      scores.reduce((a: number, b: number) => a + b, 0) / scores.length
    ).toFixed(2),
    count: scores.length,
  }));

  res.json({ ratings: summary });
};
