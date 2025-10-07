import { prismaClient } from "../database/prismaClient";
import { Request, Response } from "express";

export class ReadingGoalController {
  async findAll(request: Request, response: Response) {
    try {
      const { userId } = request.query as { userId: string };

      const goals = await prismaClient.readingGoal.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return response.json(goals);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao buscar metas", detail: error });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { title, unit, current, target, period, color, bgColor, userId } =
        request.body;

      const goal = await prismaClient.readingGoal.create({
        data: { title, unit, current, target, period, color, bgColor, userId },
      });

      return response.status(201).json(goal);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao criar meta", detail: error });
    }
  }
}
