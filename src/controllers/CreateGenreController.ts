import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateGenreController {
  async handle(request: Request, response: Response) {
    if (!request.body || Object.keys(request.body).length === 0) {
      return response.status(400).json({ error: "Request body is required" });
    }

    try {
      const payload = Array.isArray(request.body) ? request.body : [request.body];

      const valid = payload.every((p) => p && typeof p.genre === "string" && p.genre.trim() !== "");
      if (!valid) {
        return response.status(400).json({ error: "Cada gênero precisa ter um nome válido." });
      }

      if (payload.length === 1) {
        const genre = payload[0].genre;
        const genreExists = await prismaClient.genre.findFirst({ where: { genre } });
        if (genreExists) return response.status(400).json({ error: "Este gênero já existe." });

        const newGenre = await prismaClient.genre.create({ data: { genre } });
        return response.status(201).json(newGenre);
      }

      // Bulk create (skips existing check for performance)
      const created = await prismaClient.genre.createMany({ data: payload.map((p) => ({ genre: p.genre })) });
      return response.status(201).json({ count: created.count });
    } catch (error) {
      console.error("Erro ao criar gênero:", error);
      return response.status(500).json({ error: "Erro ao criar gênero." });
    }
  }
}
