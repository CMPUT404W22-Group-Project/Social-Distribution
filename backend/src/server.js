import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.router.js';
dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(fileUpload());
router(app);

//use this as the last routes, else it might interfere with other routes used for depolyment
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}... `);
});
