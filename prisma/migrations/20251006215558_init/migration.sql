/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `achievements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "achievements";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "unlockedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "books_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_books" ("authorId", "cover", "createdAt", "currentPage", "genreId", "id", "isbn", "notes", "pages", "rating", "status", "synopsis", "title", "updatedAt", "userId", "year") SELECT "authorId", "cover", "createdAt", "currentPage", "genreId", "id", "isbn", "notes", "pages", "rating", "status", "synopsis", "title", "updatedAt", "userId", "year" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE TABLE "new_reading_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "current" INTEGER NOT NULL,
    "target" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "color" TEXT,
    "bgColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_reading_goals" ("bgColor", "color", "createdAt", "current", "id", "period", "target", "title", "unit", "updatedAt", "userId") SELECT "bgColor", "color", "createdAt", "current", "id", "period", "target", "title", "unit", "updatedAt", "userId" FROM "reading_goals";
DROP TABLE "reading_goals";
ALTER TABLE "new_reading_goals" RENAME TO "reading_goals";
CREATE TABLE "new_reading_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pages" INTEGER NOT NULL,
    "books" INTEGER NOT NULL,
    "bookId" TEXT,
    CONSTRAINT "reading_progress_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_reading_progress" ("bookId", "books", "date", "id", "pages", "userId") SELECT "bookId", "books", "date", "id", "pages", "userId" FROM "reading_progress";
DROP TABLE "reading_progress";
ALTER TABLE "new_reading_progress" RENAME TO "reading_progress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_title_userId_key" ON "Achievement"("title", "userId");
