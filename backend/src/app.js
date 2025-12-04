import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import taskRouter from './routes/taskRoutes.js';
import noteRouter from './routes/noteRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

let isDbConnected = false;

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmate';
mongoose.set('strictQuery', false);
mongoose
  .connect(mongoUri)
  .then(() => {
    isDbConnected = true;
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });

// Middleware to check DB connection
app.use('/api', (req, res, next) => {
  if (!isDbConnected && req.path !== '/health') {
    return res.status(503).json({ 
      message: 'Service unavailable: Database not connected',
      retryAfter: 5
    });
  }
  next();
});

app.use('/api/tasks', taskRouter);
app.use('/api/notes', noteRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
