import { prismaClient } from "../database/prismaClient";
import { Request, Response } from "express";

export class ReadingProgressController {
  async findAll(request: Request, response: Response) {
    try {
      const { userId } = request.query as { userId: string };

      const progress = await prismaClient.readingProgress.findMany({
        where: { userId },
        orderBy: { date: "asc" },
      });

      return response.json(progress);
    } catch (error) {
      return response.status(400).json({
        error: "Erro ao buscar métricas de progresso",
        details: error,
      });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { userId, pages, books, bookId } = request.body;

      const progress = await prismaClient.readingProgress.create({
        data: { userId, pages, books, bookId },
      });

      return response.status(201).json(progress);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao criar registro de progresso", details: error });
    }
  }
}
