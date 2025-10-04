import { Router } from "express";
import { CreateAuthorController } from "./controllers/CreateAuthorController";
import { CreateBookController } from "./controllers/CreateBookController";
import { CreateGenreController } from "./controllers/CreateGenreController";
import { FindAuthorController } from "./controllers/FindAuthorController";
import { FindBookController } from "./controllers/FindBookController";
import { FindGenreController } from "./controllers/FindGenreController";

export const routes = Router();

const createBook = new CreateBookController();
const findBook = new FindBookController();

const createGenre = new CreateGenreController();
const findGenre = new FindGenreController();

const createAuthor = new CreateAuthorController();
const findAuthor = new FindAuthorController();

// Books
routes.post("/books", createBook.handle);
routes.get("/books", findBook.handle);

// Genres
routes.post("/genres", createGenre.handle);
routes.get("/genres", findGenre.handle);

// Authors
routes.post("/authors", createAuthor.handle);
routes.get("/authors", findAuthor.handle);
