const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('If you need to update your API keys, edit the .env file manually.');
  process.exit(0);
}

// Create .env template
const envTemplate = `# Server Configuration
PORT=3001

# API Keys
# Get your NewsAPI key from: https://newsapi.org/
NEWS_API_KEY=your_news_api_key_here

# Get your Cohere API key from: https://cohere.ai/
COHERE_API_KEY=your_cohere_api_key_here
`;

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Edit the .env file and replace the placeholder values with your actual API keys');
  console.log('2. Get your NewsAPI key from: https://newsapi.org/');
  console.log('3. Get your Cohere API key from: https://cohere.ai/');
  console.log('4. Run "npm start" to start the server');
  console.log('');
  console.log('⚠️  Remember: Never commit your .env file to version control!');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
} 