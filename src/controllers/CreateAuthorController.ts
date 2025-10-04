import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateAuthorController {
  async handle(request: Request, response: Response) {
    const { name } = request.body;

    try {
      if (!name) {
        return response
          .status(400)
          .json({ error: "O nome do autor é obrigatório." });
      }

      const author = await prismaClient.author.create({
        data: { name },
      });

      return response.json(author);
    } catch (error) {
      console.error("Erro ao criar autor:", error);
      return response.status(500).json({ error: "Erro ao criar autor." });
    }
  }
}
