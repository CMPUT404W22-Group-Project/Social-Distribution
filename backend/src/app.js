import express from 'express';
import router from './routes/index.router.js';
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

router(app);

export default app;
