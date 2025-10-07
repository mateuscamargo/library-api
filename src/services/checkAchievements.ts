import { ReadingProgress } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

export async function checkAchievements(userId: string) {
  const books = await prismaClient.book.findMany({ where: { userId } });
  const progress = await prismaClient.readingProgress.findMany({
    where: { userId },
  });

  // Primeira Página Virada
  if (books.length >= 1) {
    await unlock(userId, "Primeira Página Virada");
  }

  // Cinco Minutinhos
  const todayReads = progress.filter(
    (p) => new Date(p.date).toDateString() === new Date().toDateString()
  );
  if (todayReads.length >= 1) {
    await unlock(userId, "Cinco Minutinhos");
  }

  // Mini-Streak
  const streak = await calculateReadingStreak(progress);
  if (streak >= 3) {
    await unlock(userId, "Mini-Streak");
  }
}

async function unlock(userId: string, title: string) {
  const exists = await prismaClient.achievement.findFirst({
    where: { userId, title, unlocked: true },
  });
  if (!exists) {
    await prismaClient.achievement.upsert({
      where: { title_userId: { title, userId } },
      update: { unlocked: true, unlockedAt: new Date() },
      create: { title, userId, unlocked: true, unlockedAt: new Date() },
    });
  }
}

async function calculateReadingStreak(
  progress: ReadingProgress[]
): Promise<number> {
  const validDates = progress
    .map((p: ReadingProgress) => {
      const date = new Date(p.date);
      return isNaN(date.getTime()) ? null : date;
    })
    .filter((date): date is Date => date !== null)
    .map((date) => date.toDateString());

  const days = [
    ...new Set(progress.map((p) => new Date(p.date).toDateString())),
  ].sort();
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else streak = 1;
  }
  return streak;
}
