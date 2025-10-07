import { Router } from "express";

import { CreateAuthorController } from "./controllers/CreateAuthorController";
import { CreateBookController } from "./controllers/CreateBookController";
import { CreateGenreController } from "./controllers/CreateGenreController";
import { FindAuthorController } from "./controllers/FindAuthorController";
import { FindBookController } from "./controllers/FindBookController";
import { FindGenreController } from "./controllers/FindGenreController";
import { DashboardController } from "./controllers/DashboardController";
import { ReadingGoalController } from "./controllers/ReadingGoalController";
import { ReadingProgressController } from "./controllers/ReadingProgressController";
import { AchievementController } from "./controllers/AchievementController";

export const routes = Router();

const createBook = new CreateBookController();
const findBook = new FindBookController();

const createGenre = new CreateGenreController();
const findGenre = new FindGenreController();

const createAuthor = new CreateAuthorController();
const findAuthor = new FindAuthorController();

const dashboard = new DashboardController();
const readingGoal = new ReadingGoalController();
const readingProgress = new ReadingProgressController();
const achievement = new AchievementController();

// Books
routes.post("/books", createBook.handle);
routes.get("/books", findBook.handle);

// Genres
routes.post("/genres", createGenre.handle);
routes.get("/genres", findGenre.handle);

// Authors
routes.post("/authors", createAuthor.handle);
routes.get("/authors", findAuthor.handle);

// Dashboard
routes.get("/dashboard", dashboard.handle);

// Goals
routes.get("/goals", readingGoal.findAll);
routes.post("/goals", readingGoal.create);

// Progress
routes.get("/progress", readingProgress.findAll);
routes.post("/progress", readingProgress.create);

// Achievements
routes.get("/achievements", achievement.findAll);
