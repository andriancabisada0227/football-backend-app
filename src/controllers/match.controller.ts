import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMatch = async (req: Request, res: Response) => {
  const { date, competition, teamA, teamB } = req.body;

  try {
    const match = await prisma.match.create({
      data: {
        date: new Date(date),
        competition,
        teamA,
        teamB,
      },
    });

    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: "Failed to create match" });
  }
};

export const getAllMatches = async (_req: Request, res: Response) => {
  const matches = await prisma.match.findMany();
  res.json(matches);
};

export const addPlayersToMatch = async (req: Request, res: Response) => {
  const { matchId } = req.params;
  const { players } = req.body; // expects [{ name, position, team }, ...]

  try {
    const createdPlayers = await prisma.player.createMany({
      data: players.map((p: any) => ({
        name: p.name,
        position: p.position,
        team: p.team,
        matchId,
      })),
    });

    res.status(201).json({ count: createdPlayers.count });
  } catch (err) {
    res.status(400).json({ error: "Failed to add players" });
  }
};

export const getPlayersForMatch = async (req: Request, res: Response) => {
  const { matchId } = req.params;

  const players = await prisma.player.findMany({ where: { matchId } });
  res.json(players);
};
