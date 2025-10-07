const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

const PORT = process.env.PORT || 4003;
// Rotas para livros
app.get("/books", async (req, res) => {
    try {
        const books = await prisma.book.findMany({
            include: {
                author: true,
                genre: true
            }
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

app.post("/books", async (req, res) => {
    try {
        const { title, authorId, genreId } = req.body;
        const book = await prisma.book.create({
            data: {
                title,
                author: { connect: { id: authorId } },
                genre: { connect: { id: genreId } }
            }
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: "Failed to create book" });
    }
});

// Rotas para autores
app.get("/authors", async (req, res) => {
    try {
        const authors = await prisma.author.findMany();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch authors" });
    }
});

app.post("/authors", async (req, res) => {
    try {
        const { name } = req.body;
        const author = await prisma.author.create({ data: { name } });
        res.json(author);
    } catch (error) {
        res.status(500).json({ error: "Failed to create author" });
    }
});

// Rotas para gêneros
app.get("/genres", async (req, res) => {
    try {
        const genres = await prisma.genre.findMany();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch genres" });
    }
});

app.post("/genres", async (req, res) => {
    try {
        const { name } = req.body;
        const genre = await prisma.genre.create({ data: { name } });
        res.json(genre);
    } catch (error) {
        res.status(500).json({ error: "Failed to create genre" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));