import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

const app: Express = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.options('*', cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Successfully connected to MongoDB."))
    .catch(err => console.error("❌ MongoDB connection error:", err));
} else {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined.");
}

export default app;
