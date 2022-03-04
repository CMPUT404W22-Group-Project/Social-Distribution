import express from 'express';
import router from './routes/index.router.js';

const app = express();

router(app);

export default app;
