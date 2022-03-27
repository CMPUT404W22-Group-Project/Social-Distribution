import express from 'express';
import router from './routes/index.router.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'LogRocket Express API with Swagger',
			version: '0.1.0',
			description:
				'This is a simple CRUD API application made with Express and documented with Swagger',
			contact: {
				name: 'LogRocket',
				url: 'http://localhost:3000/',
				email: 'shining@ualberta.ca',
			},
		},
		servers: [
			{
				url: 'http://localhost:8000/',
			},
		],
	},
	apis: ['./src/routes/*.router.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

app.use(express.static(path.join(__dirname, '../build')));
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}... `);
});

export default app;
