/*
  Warnings:

  - Added the required column `userId` to the `achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reading_goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reading_progress` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "name" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_achievements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" DATETIME,
    "icon" TEXT,
    "badgeColor" TEXT,
    "difficultyIcon" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_achievements" ("createdAt", "description", "difficulty", "id", "title", "unlocked", "unlockedAt") SELECT "createdAt", "description", "difficulty", "id", "title", "unlocked", "unlockedAt" FROM "achievements";
DROP TABLE "achievements";
ALTER TABLE "new_achievements" RENAME TO "achievements";
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER,
    "pages" INTEGER,
    "rating" REAL,
    "synopsis" TEXT,
    "cover" TEXT,
    "status" TEXT,
    "currentPage" INTEGER,
    "isbn" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "books_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "books_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_books" ("authorId", "cover", "createdAt", "currentPage", "genreId", "id", "isbn", "notes", "pages", "rating", "status", "synopsis", "title", "updatedAt", "year") SELECT "authorId", "cover", "createdAt", "currentPage", "genreId", "id", "isbn", "notes", "pages", "rating", "status", "synopsis", "title", "updatedAt", "year" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE TABLE "new_reading_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "current" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "color" TEXT,
    "bgColor" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reading_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reading_goals" ("bgColor", "color", "createdAt", "current", "id", "period", "target", "title", "unit", "updatedAt") SELECT "bgColor", "color", "createdAt", "current", "id", "period", "target", "title", "unit", "updatedAt" FROM "reading_goals";
DROP TABLE "reading_goals";
ALTER TABLE "new_reading_goals" RENAME TO "reading_goals";
CREATE TABLE "new_reading_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pages" INTEGER NOT NULL,
    "books" INTEGER NOT NULL,
    "bookId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "reading_progress_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "reading_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reading_progress" ("bookId", "books", "date", "id", "pages") SELECT "bookId", "books", "date", "id", "pages" FROM "reading_progress";
DROP TABLE "reading_progress";
ALTER TABLE "new_reading_progress" RENAME TO "reading_progress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
