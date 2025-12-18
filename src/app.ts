import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoute'
import cors from 'cors';
import noteRoutes from './routes/noteRoute'

dotenv.config({ path: path.resolve(__dirname, '../.env') });  

const app = express();

app.use(express.json())
app.use(cors())

console.log(process.env.PORT, process.env.DB_CONNECT, "this is me")
mongoose.connect(process.env.DB_CONNECT as string)
    .then((result) => app.listen(process.env.PORT))
    .catch((err) => console.log(err, "error"));

app.use('/api/user', authRoutes);
app.use('/api/notes', noteRoutes);
