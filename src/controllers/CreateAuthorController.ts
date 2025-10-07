import { Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export class CreateAuthorController {
  async handle(request: Request, response: Response) {
    if (!request.body || Object.keys(request.body).length === 0) {
      return response.status(400).json({ error: "Request body is required" });
    }

    try {
      const payload = Array.isArray(request.body)
        ? request.body
        : [request.body];

      const valid = payload.every(
        (p) => p && typeof p.name === "string" && p.name.trim() !== ""
      );
      if (!valid) {
        return response
          .status(400)
          .json({ error: "Cada autor precisa ter um nome válido." });
      }

      if (payload.length === 1) {
        const author = await prismaClient.author.create({
          data: { name: payload[0].name },
        });
        return response.status(201).json(author);
      }

      const created = await prismaClient.author.createMany({
        data: payload.map((p) => ({ name: p.name })),
      });
      return response.status(201).json({ count: created.count });
    } catch (error) {
      console.error("Erro ao criar autor:", error);
      return response.status(500).json({ error: "Erro ao criar autor." });
    }
  }
}
