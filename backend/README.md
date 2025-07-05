# EILI5 Backend API

Express.js server that fetches news headlines and explains them like you're 5 using Cohere AI.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - **NewsAPI**: Get a free API key from [NewsAPI.org](https://newsapi.org/)
   - **Cohere**: Get an API key from [Cohere.ai](https://cohere.ai/)
   
   Create a `.env` file in the backend directory:
   ```bash
   # Server Configuration
   PORT=3001
   
   # API Keys
   NEWS_API_KEY=your_news_api_key_here
   COHERE_API_KEY=your_cohere_api_key_here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## How it works

1. **News Fetching**: Searches for the most relevant news article about the topic using NewsAPI
2. **AI Explanation**: Sends the headline + description to Cohere's command-r-plus model
3. **Child-Friendly Output**: Returns a simple, friendly, and maybe silly explanation

## API Endpoints

### POST `/api/explain`
Fetches news and generates a child-friendly explanation.

**Request:**
```json
{
  "topic": "artificial intelligence"
}
```

**Response:**
```json
{
  "explanation": "Imagine if your toy robot could think like you do! That's what artificial intelligence is like...",
  "topic": "artificial intelligence"
}
```

### GET `/api/health`
Health check endpoint.

## Environment Variables

- `NEWS_API_KEY` - Your NewsAPI key (required)
- `COHERE_API_KEY` - Your Cohere API key (required)
- `PORT` - Server port (default: 3001)

## AI Model Configuration

- **Model**: command-r-plus
- **Max Tokens**: 300
- **Temperature**: 0.7 (creative but focused)
- **Prompt**: "Explain this like I'm 5: [headline + description]. Make it super simple, friendly, and maybe a little silly."

## Environment Setup

The server uses `dotenv` to load environment variables from a `.env` file. Create this file in the backend directory with your API keys:

```env
# Server Configuration
PORT=3001

# API Keys
NEWS_API_KEY=your_actual_news_api_key
COHERE_API_KEY=your_actual_cohere_api_key
```

**Important**: Never commit your `.env` file to version control. It's already added to `.gitignore`. 