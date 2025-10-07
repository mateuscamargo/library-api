import { prismaClient } from "../database/prismaClient";
import { Request, Response } from "express";

export class AchievementController {
  async findAll(request: Request, response: Response) {
    try {
      const { userId } = request.query as { userId: string };

      const achievements = await prismaClient.achievement.findMany({
        where: { userId },
        orderBy: { unlockedAt: "desc" },
      });

      const formatted = achievements.map((a) => ({
        id: a.id,
        title: a.title,
        unlocked: a.unlocked,
        unlockedAt: a.unlockedAt,
        difficulty: a.difficulty,
        description: a.description,
      }));

      return response.json(formatted);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao buscar conquista", details: error });
    }
  }
}
