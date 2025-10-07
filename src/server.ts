import cors from "cors";
import express from "express";
import { routes } from "./routes";

const app = express();

// ✅ Configuração CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://d-library-six.vercel.app",
  "https://libraryapi.up.railway.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(routes);

// ✅ Error handler para JSON malformado
app.use((err: any, req: any, res: any, next: any) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON in request body" });
  }

  return next(err);
});

const PORT = process.env.PORT || 4003;
app.listen(Number(PORT), () =>
  console.log(`Server is running on PORT ${PORT}`)
);
