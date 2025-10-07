import express from "express";
import { routes } from "./routes";

const app = express();

app.use(express.json());
app.use(routes);

// Error handler for malformed JSON (body-parser)
app.use((err: any, req: any, res: any, next: any) => {
	if (err && err.type === 'entity.parse.failed') {
		return res.status(400).json({ error: 'Malformed JSON in request body' });
	}

	// Fallback to default error handler
	return next(err);
});

const PORT = process.env.PORT || 4003;
app.listen(Number(PORT), () => console.log(`Server is running on PORT ${PORT}`));
