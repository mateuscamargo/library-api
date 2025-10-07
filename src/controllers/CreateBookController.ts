import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";
import { checkAchievements } from "../services/checkAchievements";

export class CreateBookController {
  async handle(request: Request, response: Response) {
    if (!request.body || Object.keys(request.body).length === 0) {
      return response.status(400).json({ error: "Request body is required" });
    }

    try {
      const payload = Array.isArray(request.body) ? request.body : [request.body];

      // Validate minimal fields if present
      const valid = payload.every((p) => p && typeof p.title === "string" && p.title.trim() !== "");
      if (!valid) {
        return response.status(400).json({ error: "Cada livro precisa ter um título válido." });
      }

      if (payload.length === 1) {
        const p = payload[0];
        // userId optional now
        const userId = p?.user?.connect?.id ?? p.userId ?? null;

        const data: any = {
          title: p.title,
          authorId: p.authorId,
          genreId: p.genreId,
          year: p.year,
          pages: p.pages,
          rating: p.rating,
          synopsis: p.synopsis,
          cover: p.cover,
          status: p.status,
          currentPage: p.currentPage,
          isbn: p.isbn,
          notes: p.notes,
        };

        if (userId) data.userId = userId;

        const book = await prismaClient.book.create({ data });

        if (userId) await checkAchievements(userId);

        return response.status(201).json(book);
      }

      // Bulk create: map to createMany input. Note: createMany doesn't support relational connect syntax.
      const createManyData = payload.map((p) => ({
        title: p.title,
        authorId: p.authorId,
        genreId: p.genreId,
        userId: p?.user?.connect?.id ?? p.userId ?? null,
        year: p.year,
        pages: p.pages,
        rating: p.rating,
        synopsis: p.synopsis,
        cover: p.cover,
        status: p.status,
        currentPage: p.currentPage,
        isbn: p.isbn,
        notes: p.notes,
      }));

      const result = await prismaClient.book.createMany({ data: createManyData });

      // Trigger achievements check for any provided userIds
      const userIds = Array.from(new Set(createManyData.map((d) => d.userId).filter(Boolean)));
      for (const uid of userIds) {
        await checkAchievements(uid as string);
      }

      return response.status(201).json({ count: result.count });
    } catch (error) {
      return response.status(400).json({ error: "Erro ao criar livro", details: error });
    }
  }
}
