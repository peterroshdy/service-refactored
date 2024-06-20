import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import placeRoutes from './routes/placeRoutes';
import connectDB from './config/database';
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Connect to MongoDB
connectDB();

app.use(express.json({ limit: '50mb' }));

// Use the place routes
app.use('/api/places', placeRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
