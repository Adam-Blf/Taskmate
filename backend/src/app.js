import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import taskRouter from './routes/taskRoutes.js';
import noteRouter from './routes/noteRoutes.js';
import geminiRouter from './routes/geminiRoutes.js';
import keepAliveService from './services/keepAlive.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

let isDbConnected = false;

// Health check endpoint (must be before other routes)
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    database: isDbConnected ? 'connected' : 'connecting',
    keepAlive: keepAliveService.getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ 
    message: 'TaskMate API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      notes: '/api/notes',
      gemini: '/api/gemini'
    }
  });
});

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

// Middleware to check DB connection (only for data routes)
const checkDbConnection = (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({ 
      error: 'Service unavailable: Database not connected',
      retryAfter: 5
    });
  }
  next();
};

app.use('/api/tasks', checkDbConnection, taskRouter);
app.use('/api/notes', checkDbConnection, noteRouter);
app.use('/api/gemini', geminiRouter); // Gemini doesn't need DB

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
