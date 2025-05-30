import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTopRatedPlayers = async (_req: Request, res: Response) => {
  const grouped = await prisma.rating.groupBy({
    by: ['playerId'],
    _avg: { score: true },
    _count: true,
    orderBy: {
      _avg: {
        score: 'desc'
      }
    },
    take: 10
  });

  const players = await prisma.player.findMany();

  const top = grouped.map((entry) => {
    const player = players.find(p => p.id === entry.playerId);
    return {
      name: player?.name,
      team: player?.team,
      avgScore: entry._avg.score,
      ratings: entry._count,
    };
  });

  res.json(top);
};

export const getMostActiveRaters = async (_req: Request, res: Response) => {
  const grouped = await prisma.rating.groupBy({
    by: ['userId'],
    _count: true,
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 10
  });

  const users = await prisma.user.findMany();

  const top = grouped.map((entry) => {
    const user = users.find(u => u.id === entry.userId);
    return {
      userId: user?.id,
      displayName: user?.displayName,
      ratingsCount: entry._count.id,
    };
  });

  res.json(top);
};
