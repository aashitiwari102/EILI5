require('dotenv').config();

// Use node-fetch v2 for compatibility, fallback to global fetch if available (Node 18+)
let fetch;
try {
  fetch = global.fetch || require('node-fetch');
} catch (e) {
  fetch = require('node-fetch');
}

// Ensure required environment variables are loaded
const requiredEnv = ['COHERE_API_KEY', 'NEWS_API_KEY'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[EILI5] Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.post('/api/explain', async (req, res) => {
  try {
    const { topic } = req.body;
    console.log(`[EILI5] Incoming topic:`, topic);
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required and must be a non-empty string' });
    }
    if (!process.env.NEWS_API_KEY) {
      return res.status(500).json({ error: 'NewsAPI key not configured' });
    }
    if (!process.env.COHERE_API_KEY) {
      return res.status(500).json({ error: 'Cohere API key not configured' });
    }

    // --- NewsAPI fetch with error handling ---
    let newsData;
    try {
      const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic.trim())}&apiKey=${process.env.NEWS_API_KEY}&pageSize=1&sortBy=relevancy`;
      const newsResponse = await fetch(newsApiUrl);
      newsData = await newsResponse.json();
      if (!newsResponse.ok) {
        console.error('NewsAPI error:', newsData);
        return res.status(500).json({ error: newsData.message || 'Failed to fetch news data' });
      }
    } catch (err) {
      console.error('NewsAPI fetch failed:', err);
      return res.status(500).json({ error: 'Failed to fetch news data (network error)' });
    }

    // --- Check for articles ---
    let headline = '';
    if (
      Array.isArray(newsData.articles) &&
      newsData.articles.length > 0
    ) {
      const article = newsData.articles[0];
      const title = article.title || '';
      const description = article.description || '';
      headline = `${title}\n\n${description}`;
      console.log(`[EILI5] NewsAPI headline:`, headline);
    } else {
      console.error('[EILI5] NewsAPI response missing articles array:', newsData);
      return res.status(404).json({
        error: `No recent news found about "${topic}". Please try a different or more general topic!`
      });
    }

    // --- Cohere REST API call with error handling ---
    let explanation;
    try {
      const prompt = `Explain this like I'm 5: ${headline}. Make it super simple, friendly, and maybe a little silly.`;
      console.log('[EILI5] Cohere prompt:', prompt);
      const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command-r-plus',
          prompt: prompt,
          max_tokens: 300,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        })
      });
      const cohereData = await cohereResponse.json();
      if (!cohereResponse.ok || !cohereData.generations || cohereData.generations.length === 0) {
        console.error('[EILI5] Cohere response missing generations:', cohereData);
        throw new Error('No response from Cohere API');
      }
      explanation = cohereData.generations[0].text.trim();
      console.log(`[EILI5] Cohere explanation:`, explanation);
    } catch (err) {
      console.error('[EILI5] Cohere API error:', err);
      return res.status(500).json({ error: 'Failed to generate explanation from Cohere' });
    }

    res.json({ explanation, topic: topic.trim() });

  } catch (error) {
    console.error('[EILI5] Error processing explanation request:', error);
    res.status(500).json({
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong while processing your request'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EILI5 API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EILI5 API server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/explain`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📰 NewsAPI: ${process.env.NEWS_API_KEY ? 'Configured' : 'Not configured'}`);
  console.log(`🤖 Cohere: ${process.env.COHERE_API_KEY ? 'Configured' : 'Not configured'}`);
}); 