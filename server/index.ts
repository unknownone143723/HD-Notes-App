import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';


dotenv.config();

const app: Express = express();

const frontendURL="http://localhost:5173";
app.use(cors({
    origin: frontendURL
}));
app.use(express.json()); 

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Notes App API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB."))
    .catch(err => {
        console.error("Connection error", err);
        process.exit(1);
    });


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
