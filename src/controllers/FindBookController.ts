import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindBookController {
  async handle(request: Request, response: Response) {
    const { id } = request.query;

    try {
      if (id) {
        const idNum = Number(id as string);
        if (isNaN(idNum)) {
          return response.status(400).json({ error: "ID inválido." });
        }

        const book = await prismaClient.book.findUnique({
          where: { id: idNum },
          include: { author: true, genre: true },
        });
        return response.json(book);
      }

      const books = await prismaClient.book.findMany({
        include: { author: true, genre: true },
      });
      return response.json(books);
    } catch (error) {
      return response
        .status(400)
        .json({ error: "Erro ao buscar livros", details: error });
    }
  }
}
