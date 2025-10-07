import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindGenreController {
  async handle(request: Request, response: Response) {
    const { id } = request.query as { id?: string };

    try {
      if (id) {
        const genre = await prismaClient.genre.findUnique({
          where: { id: Number(id) },
          include: { book: true },
        });

        if (!genre) {
          return response.status(404).json({ error: "Gênero não encontrado." });
        }

        return response.json(genre);
      }

      const genres = await prismaClient.genre.findMany({
        include: { book: true },
      });

      return response.json(genres);
    } catch (error) {
      console.error("Erro ao buscar gêneros:", error);
      return response.status(500).json({ error: "Erro ao buscar gêneros." });
    }
  }
}
