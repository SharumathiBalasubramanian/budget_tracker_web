const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { generateContent } = require('./services/geminiService');

// Establish database connection
connectDB();

const app = express();

// Security: Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Cross-Origin Request Blocked by CORS'));
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Apply rate limiter specifically to auth endpoints
app.use('/api/auth', authLimiter);

// -------------------------------------------------------------
// Direct handler for the Dashboard AI Insights endpoint
// Solves: POST http://localhost:5000/api/insights/gemini 404
// -------------------------------------------------------------
app.post('/api/insights/gemini', async (req, res) => {
  try {
    const { transactions, budgets, prompt: userPrompt } = req.body;

    const systemInstruction =
      "You are a friendly and smart financial advisor. Analyze the user's budgets and recent transactions, then give 2 to 3 concise, actionable spending tips.";

    const prompt =
      userPrompt ||
      `Financial status summary:
Budgets: ${JSON.stringify(budgets || [])}
Transactions: ${JSON.stringify(transactions || [])}

Provide 2-3 brief, helpful spending tips.`;

    const reply = await generateContent(prompt, systemInstruction);

    return res.status(200).json({
      success: true,
      insights: reply,
      reply: reply,
    });
  } catch (error) {
    console.error('Error generating Gemini insights:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI insights.',
    });
  }
});

// Standard API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Centralized error handling (MUST remain at the bottom)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});