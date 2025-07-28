// src/index.ts

import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

const app: Express = express();

const allowedOrigins = [
    process.env.FRONTEND_URL, 
    'http://localhost:5173' 
].filter(Boolean); 

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log("Successfully connected to MongoDB."))
        .catch(err => console.error("Connection error", err));
} else {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
}


export default app;
