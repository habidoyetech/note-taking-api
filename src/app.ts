import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });  

const app = express();

console.log(process.env.PORT, process.env.DB_CONNECT, "this is me")
mongoose.connect(process.env.DB_CONNECT as string)
    .then((result) => app.listen(process.env.PORT))
    .catch((err) => console.log(err, "error"));
