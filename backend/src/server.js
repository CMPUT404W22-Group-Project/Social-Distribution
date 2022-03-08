import express from 'express';
import router from './routes/index.router.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(
	cors({
		origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
		credentials: true,
		exposedHeaders: ['set-cookie'],
	})
);

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());
router(app);
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}... `);
});

export default app;
