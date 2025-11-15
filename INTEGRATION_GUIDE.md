# Sense Backend Integration Guide

This guide will help you set up and integrate the Custom GPT backend with your Sense neural page.

## 📋 What We've Built

✅ **Backend Server** (`sense-backend/`)
- Express.js server with OpenAI integration
- Session management for chat conversations
- Rate limiting and CORS configuration
- Health check endpoint

✅ **Frontend Integration**
- Updated `ChatInterface` component to connect to backend
- API utility functions in `src/lib/api/chat.ts`
- Session management and error handling
- Connection status indicators

## 🚀 Quick Start

### Step 1: Set Up Backend

1. **Navigate to backend directory:**
   ```bash
   cd sense-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file and add:**
   ```env
   PORT=8080
   OPENAI_API_KEY=sk-your-actual-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   SYSTEM_PROMPT="Your Custom GPT system prompt here"
   ```

   **What you need to provide:**
   - `OPENAI_API_KEY`: Your OpenAI API key (get it from https://platform.openai.com/api-keys)
   - `OPENAI_MODEL`: The model you want to use (e.g., `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`)
   - `SYSTEM_PROMPT`: Copy the system prompt from your Custom GPT configuration

5. **Start the backend:**
   ```bash
   npm run dev
   ```

   You should see: `🚀 Sense backend listening on port 8080`

### Step 2: Set Up Frontend

1. **Create frontend environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local` file:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

   If your backend is running on a different port or URL, update this accordingly.

3. **Start the frontend (in the root directory):**
   ```bash
   npm run dev
   ```

4. **Test the integration:**
   - Navigate to `http://localhost:3000/neural`
   - You should see "● Connected" in the chat header
   - Try sending a message!

## 🔧 Configuration Details

### Backend Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `8080` |
| `OPENAI_API_KEY` | **Yes** | Your OpenAI API key | - |
| `OPENAI_MODEL` | No | Model identifier | `gpt-4o-mini` |
| `SYSTEM_PROMPT` | **Yes** | Your Custom GPT persona prompt | - |
| `AUTH_KEY` | No | API authentication key | - |
| `FRONTEND_URL` | No | CORS origin | `*` |
| `REDIS_URL` | No | Redis connection (for production) | - |

### Frontend Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | No | Backend API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_API_KEY` | No | API key if backend requires auth | - |

## 📝 Getting Your Custom GPT System Prompt

1. Go to your Custom GPT in ChatGPT
2. Click on the GPT name → "Edit GPT"
3. Scroll to "Instructions" or "System Prompt"
4. Copy the entire prompt text
5. Paste it into your backend `.env` file as `SYSTEM_PROMPT`

**Example:**
```env
SYSTEM_PROMPT="You are SenseBot — friendly, factual, and helpful. You specialize in helping users understand Sense products. Answer concisely and expand when needed."
```

## 🧪 Testing

1. **Test backend health:**
   ```bash
   curl http://localhost:8080/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test session creation:**
   ```bash
   curl -X POST http://localhost:8080/session \
     -H "Content-Type: application/json"
   ```
   Should return: `{"sessionId":"uuid-here"}`

3. **Test chat endpoint:**
   ```bash
   curl -X POST http://localhost:8080/chat \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"your-session-id","message":"Hello!"}'
   ```

## 🐛 Troubleshooting

### Backend Issues

**"OPENAI_API_KEY not set"**
- Make sure you've created `.env` file in `sense-backend/` directory
- Check that the API key is correct (starts with `sk-`)

**"OpenAI API error 401"**
- Your API key is invalid or expired
- Check your OpenAI account billing status

**"OpenAI API error 429"**
- You've hit rate limits
- Wait a moment and try again

### Frontend Issues

**"Failed to connect to Sense"**
- Make sure backend is running (`npm run dev` in `sense-backend/`)
- Check that `NEXT_PUBLIC_API_URL` matches your backend URL
- Check browser console for CORS errors

**"Connection Error" in chat header**
- Backend might not be running
- Check backend logs for errors
- Verify the API URL is correct

## 🚢 Production Deployment

### Backend Deployment Options

1. **Heroku/Render:**
   - Add environment variables in dashboard
   - Deploy from `sense-backend/` directory

2. **Vercel (Serverless):**
   - Create `vercel.json` in backend
   - Configure as serverless function

3. **AWS/DigitalOcean:**
   - Use PM2 or systemd to keep server running
   - Set up reverse proxy (nginx)

### Production Checklist

- [ ] Set `AUTH_KEY` in backend `.env`
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Implement Redis for session storage (optional but recommended)
- [ ] Use HTTPS
- [ ] Monitor OpenAI API usage
- [ ] Set up error logging
- [ ] Configure rate limiting per user

## 📚 Next Steps

- **Add Redis:** For production session storage
- **Streaming:** Implement streaming responses for better UX
- **RAG:** Add vector database for long-term memory
- **Analytics:** Track usage and costs
- **Authentication:** Add user authentication if needed

## ❓ Need Help?

If you encounter issues:
1. Check backend logs in terminal
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test backend endpoints directly with curl/Postman

