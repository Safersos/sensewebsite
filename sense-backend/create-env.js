import { writeFileSync } from 'fs';

const envContent = `# Server Configuration
PORT=8080

# OpenAI API Configuration
OPENAI_API_KEY=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

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
console.log('✅ .env file created successfully with your API key!');
console.log('📝 Location: sense-backend/.env');

