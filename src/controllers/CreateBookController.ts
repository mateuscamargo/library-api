import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import { checkAchievements } from "../services/checkAchievements";

export class CreateBookController {
  async handle(request: Request, response: Response) {
    const {
      title,
      authorId,
      genreId,
      year,
      pages,
      rating,
      synopsis,
      cover,
      status,
      currentPage,
      isbn,
      notes,
      user: {
        connect: { id: userId },
      },
    } = request.body;

    try {
      if (!userId) {
        return response.status(401).json({ error: "Usuário não autenticado" });
      }

      const book = await prismaClient.book.create({
        data: {
          title,
          authorId,
          genreId,
          userId,
          year,
          pages,
          rating,
          synopsis,
          cover,
          status,
          currentPage,
          isbn,
          notes,
        },
      });

      await checkAchievements(userId);

      return response.json(book);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao criar livro", details: error });
    }
  }
}
