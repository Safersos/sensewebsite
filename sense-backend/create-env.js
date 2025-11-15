import { writeFileSync, existsSync } from 'fs';

// Check if .env already exists
if (existsSync('.env')) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('📝 If you need to update it, edit sense-backend/.env manually.');
  process.exit(0);
}

// Template for .env file - user needs to add their API key
const envContent = `# Server Configuration
PORT=8080

# OpenAI API Configuration
# IMPORTANT: Add your OpenAI API key here (get it from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your-api-key-here

# Model to use (options: gpt-4o-mini, gpt-4o, gpt-4-turbo, etc.)
OPENAI_MODEL=gpt-4o-mini

# System Prompt - Replace this with your Custom GPT's system prompt
SYSTEM_PROMPT="You are SenseBot — friendly, factual, and helpful. Use product documentation when supplied. Answer concisely and then expand when needed."

# Optional: API Authentication (leave empty for development)
# AUTH_KEY=

# Optional: CORS Configuration (leave as * for development)
# FRONTEND_URL=*

# Optional: Redis Configuration (for production)
# REDIS_URL=redis://:password@host:6379
`;

writeFileSync('.env', envContent);
console.log('✅ .env template file created!');
console.log('📝 IMPORTANT: Edit sense-backend/.env and add your OpenAI API key to OPENAI_API_KEY');
console.log('📝 Location: sense-backend/.env');

