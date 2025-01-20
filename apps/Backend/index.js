import express from 'express';
import cors from 'cors';
import router from './src/routes/index.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
app.use(cors(
    {
  origin: 'http://localhost:5178',// Your frontend URL (must be exact)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", router);
//http://localhost/api/v1/user/signup 

mongoose.connect(process.env.DATABASE_URL, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
}).then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.log("Failed to connect to MongoDB:", error.message);
})
