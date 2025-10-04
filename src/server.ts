import express from "express";
import { routes } from "./routes";

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 4003;
app.listen(Number(PORT), () => console.log(`Server is running on PORT ${PORT}`));
