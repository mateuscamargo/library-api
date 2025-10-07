import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class FindAuthorController {
  async handle(request: Request, response: Response) {
    const { id } = request.query;

    try {
      if (id) {
        const idStr = id as string;
        if (!idStr || typeof idStr !== "string") {
          return response.status(400).json({ error: "ID inválido." });
        }

        const author = await prismaClient.author.findUnique({
          where: { id: Number(idStr) },
          include: { books: true },
        });

        if (!author) {
          return response.status(404).json({ error: "Autor não encontrado." });
        }

        return response.json(author);
      }

      const authors = await prismaClient.author.findMany({
        include: { books: true },
      });

      return response.json(authors);
    } catch (error) {
      console.error("Erro ao buscar autores:", error);
      return response.status(500).json({ error: "Erro ao buscar autores." });
    }
  }
}
