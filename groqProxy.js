import express from 'express';
import Groq from 'groq-sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Initialize Groq client
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main chat endpoint for Groq API
app.post('/api/groq-chat', async (req, res) => {
  try {
    console.log('--- Incoming /api/groq-chat request body ---');
    console.dir(req.body, { depth: 5 });
    const { messages, model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error('400 Bad Request: Missing or invalid messages array. Received:', req.body);
      return res.status(400).json({
        error: 'Missing or invalid messages array.',
        received: typeof messages,
        body: req.body
      });
    }

    console.log('Groq API Request:', {
      model: model || 'openai/gpt-oss-20b',
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
      firstMessage: messages[0]
    });

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: model || 'openai/gpt-oss-20b',
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 1,
      stream: false
    });

    console.log('Groq API Response received successfully');
    res.json(chatCompletion);

  } catch (error) {
    console.error('Groq API Error:', error);
    if (req && req.body) {
      console.error('Request body that caused error:', JSON.stringify(req.body, null, 2));
    }
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;

    if (error.message) {
      errorMessage = error.message;

      // Handle specific Groq API errors
      if (error.message.includes('rate limit')) {
        statusCode = 429;
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
      } else if (error.message.includes('authentication')) {
        statusCode = 401;
        errorMessage = 'Authentication failed. Please check API key.';
      } else if (error.message.includes('model')) {
        statusCode = 400;
        errorMessage = 'Invalid model specified.';
      }
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestBody: req.body
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Express Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.listen(port, () => {
  console.log(`🚀 Groq proxy server running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/health`);
  console.log(`🤖 Chat endpoint: http://localhost:${port}/api/groq-chat`);
  
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  WARNING: GROQ_API_KEY not found in environment variables');
    console.log('Please set your Groq API key in the .env file');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Groq proxy server shutting down...');
  process.exit(0);
});