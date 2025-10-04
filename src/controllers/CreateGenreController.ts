import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateGenreController {
  async handle(request: Request, response: Response) {
    const { genre } = request.body;

    try {
      if (!genre) {
        return response
          .status(400)
          .json({ error: "O nome do gênero é obrigatório." });
      }

      const genreExists = await prismaClient.genre.findFirst({
        where: { genre },
      });

      if (genreExists) {
        return response.status(400).json({ error: "Este gênero já existe." });
      }

      const newGenre = await prismaClient.genre.create({
        data: { genre },
      });

      return response.json(newGenre);
    } catch (error) {
      console.error("Erro ao criar gênero:", error);
      return response.status(500).json({ error: "Erro ao criar gênero." });
    }
  }
}
