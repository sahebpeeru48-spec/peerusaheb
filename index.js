import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import symptomsRoutes from './routes/symptoms.js';
import facilitiesRoutes from './routes/facilities.js';
import recordsRoutes from './routes/records.js';
import appointmentsRoutes from './routes/appointments.js';
import wellnessRoutes from './routes/wellness.js';
import userRoutes from './routes/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/facilities', facilitiesRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'HealthAI – Your Smart Healthcare Assistant',
    version: '1.0.0',
    aiEngineActive: !!process.env.GEMINI_API_KEY ? 'Gemini 1.5 Flash' : 'HealthAI Clinical Engine',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if dist folder exists (production mode)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // In dev mode when dist is not built yet, return simple API status
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>HealthAI Backend API</title></head>
        <body style="font-family: system-ui, sans-serif; padding: 40px; line-height: 1.6; max-width: 600px; margin: auto;">
          <h2 style="color: #0d9488;">HealthAI Backend Server Running</h2>
          <p>The Express backend is live on port ${PORT}.</p>
          <p>Frontend Vite dev server runs at <a href="http://localhost:5173" style="color: #0284c7;">http://localhost:5173</a>.</p>
        </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🩺 HealthAI Backend running at http://localhost:${PORT}`);
  console.log(`🛡️ AI Mode: ${process.env.GEMINI_API_KEY ? 'Google Gemini Configured' : 'Clinical NLP Fallback Engine Active'}`);
  console.log(`🚀 Ready for Hackathon Demonstration`);
  console.log(`=======================================================`);
});
