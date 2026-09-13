import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables immediately before any static route or model imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './db/index.js';

// Route imports
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import companyRoutes from './routes/companies.js';
import examRoutes from './routes/exams.js';
import blogRoutes from './routes/blog.js';
import adminRoutes from './routes/admin.js';
import quizRoutes from './routes/quizzes.js';
import forumRoutes from './routes/forums.js';

// Connect to Database
import { runCleanup } from './scratch/clean_db_categories.js';
import { scrapeAndUpsertData } from './services/scraperService.js';

connectDB().then(async () => {
  // Run category and link cleanup on startup
  try {
    await runCleanup();
  } catch (err) {
    console.error('Startup cleanup failed:', err.message);
  }

  // Setup background live scraping (every 12 hours)
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  setInterval(async () => {
    try {
      await scrapeAndUpsertData();
    } catch (err) {
      console.error('Background scraper failed:', err.message);
    }
  }, TWELVE_HOURS);
});


const app = express();

// ES Modules __dirname fix is handled at the top of the file

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://jharkhand-jobs.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(',').map(item => item.trim()));
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow local development tools (like Postman or mobile clients) and any localhost/127.0.0.1 port
    if (!origin) return callback(null, true);
    if (
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin) ||
      allowedOrigins.indexOf(origin) !== -1
    ) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy blocked access from Origin: ${origin}`), false);
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Jharkhand Jobs API is running' });
});

// API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/forums', forumRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
