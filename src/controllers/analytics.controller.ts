import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

// Trending Players (last 7d vs prev 7d)
export const getTrendingPlayers = async (_req: Request, res: Response) => {
  const now = new Date();
  const lastWeek = subDays(now, 7);
  const prevWeek = subDays(lastWeek, 7);

  // Get last 14 days of ratings
  const ratings = await prisma.rating.findMany({
    where: { createdAt: { gte: prevWeek } },
    include: { player: true },
  });

  const trends: Record<string, { player: any, recent: number[], past: number[] }> = {};

  ratings.forEach(r => {
    const key = r.playerId;
    if (!trends[key]) {
      trends[key] = { player: r.player, recent: [], past: [] };
    }
    if (r.createdAt > lastWeek) {
      trends[key].recent.push(r.score);
    } else {
      trends[key].past.push(r.score);
    }
  });

  const trending = Object.entries(trends).map(([id, data]) => {
    const recentAvg = data.recent.length ? avg(data.recent) : null;
    const pastAvg = data.past.length ? avg(data.past) : null;
    const change = recentAvg !== null && pastAvg !== null
      ? (recentAvg - pastAvg)
      : null;

    return {
      playerId: id,
      name: data.player.name,
      team: data.player.team,
      change,
      recentAvg,
      pastAvg,
    };
  }).filter(t => t.change !== null)
    .sort((a, b) => Math.abs(b.change!) - Math.abs(a.change!));

  res.json(trending.slice(0, 10));
};

function avg(arr: number[]) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

export const getUserRatingInsights = async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    const userRatings = await prisma.rating.findMany({
      where: { userId },
      include: { player: true },
    });
  
    const allRatings = await prisma.rating.findMany({
      include: { player: true },
    });
  
    const roles = ['GK', 'DF', 'MF', 'FW'];
  
    const roleStats: Record<string, { userAvg: number, communityAvg: number }> = {};
  
    for (const role of roles) {
      const userScores = userRatings.filter(r => r.player.position === role).map(r => r.score);
      const allScores = allRatings.filter(r => r.player.position === role).map(r => r.score);
  
      if (allScores.length > 0) {
        roleStats[role] = {
          userAvg: userScores.length ? avg(userScores) : 0,
          communityAvg: avg(allScores),
        };
      }
    }
  
    res.json({ insights: roleStats });
  };
  