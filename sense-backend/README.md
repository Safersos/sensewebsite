# Sense Backend API

Backend server for integrating Custom GPT with the Sense neural page chat interface.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `OPENAI_MODEL` - Model to use (e.g., `gpt-4o-mini`, `gpt-4o`, `gpt-4`)
   - `SYSTEM_PROMPT` - Your Custom GPT system prompt

3. **Run the server:**
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### `POST /session`
Creates a new chat session.

**Response:**
```json
{
  "sessionId": "uuid-here"
}
```

### `POST /chat`
Sends a message and receives a reply.

**Request:**
```json
{
  "sessionId": "uuid-here",
  "message": "Hello!",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "reply": "Assistant response here",
  "sessionId": "uuid-here"
}
```

### `GET /health`
Health check endpoint.

## Environment Variables

- `PORT` - Server port (default: 8080)
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `OPENAI_MODEL` - Model identifier (default: gpt-4o-mini)
- `SYSTEM_PROMPT` - System prompt for the assistant
- `AUTH_KEY` - Optional API key for authentication
- `FRONTEND_URL` - CORS origin (default: *)
- `REDIS_URL` - Optional Redis connection string for production

## Production Notes

- For production, implement Redis for session storage (currently uses in-memory Map)
- Set `AUTH_KEY` and use it in frontend requests
- Configure `FRONTEND_URL` to your actual domain
- Consider adding streaming support for better UX
- Monitor OpenAI API usage and costs

