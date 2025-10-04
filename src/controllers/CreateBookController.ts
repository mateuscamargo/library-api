import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

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
    } = request.body;

    try {
      const book = await prismaClient.book.create({
        data: {
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
        },
      });

      return response.json(book);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao criar livro", details: error });
    }
  }
}
