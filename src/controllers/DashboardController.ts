import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class DashboardController {
  async handle(request: Request, response: Response) {
    try {
      const { userId } = request.query as { userId: string };

      const [lidos, lendo, pausados, queroLer, abandonados] = await Promise.all(
        [
          prismaClient.book.count({ where: { userId, status: "LIDO" } }),
          prismaClient.book.count({ where: { userId, status: "LENDO" } }),
          prismaClient.book.count({ where: { userId, status: "PAUSADO" } }),
          prismaClient.book.count({ where: { userId, status: "QUERO_LER" } }),
          prismaClient.book.count({ where: { userId, status: "ABANDONADO" } }),
        ]
      );

      const pagesReadAgg = await prismaClient.book.aggregate({
        _sum: { pages: true },
        where: { userId, status: "LIDO" },
      });
      const totalPagesRead = pagesReadAgg._sum?.pages ?? 0;

      const genres = await prismaClient.book.groupBy({
        by: ["genreId"],
        _count: { genreId: true },
        where: { userId, status: "LIDO" },
        orderBy: { _count: { genreId: "desc" } },
        take: 1,
      });

      let mostReadGenre = null;
      if (genres.length > 0) {
        const genre = await prismaClient.genre.findUnique({
          where: { id: genres[0].genreId },
        });
        mostReadGenre = {
          name: genre?.genre || "Desconhecido",
          count: genres[0]._count.genreId,
        };
      }

      const currentReading = await prismaClient.book.findFirst({
        where: { userId, status: "LENDO" },
        include: { author: true },
        orderBy: { updatedAt: "desc" },
      });

      const currentReadingData = currentReading
        ? {
            title: currentReading.title,
            author: currentReading.author.name,
            pages: currentReading.pages,
            currentPage: currentReading.currentPage,
            progress: Math.round(
              ((currentReading.currentPage ?? 0) /
                (currentReading.pages ?? 1)) *
                100
            ),
          }
        : null;

      return response.json({
        stats: {
          lidos,
          lendo,
          pausados,
          queroLer,
          abandonados,
          totalPagesRead,
        },
        mostReadGenre,
        currentReading: currentReadingData,
      });
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao gerar métricas", detail: error });
    }
  }
}
