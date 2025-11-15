# Quick Setup Instructions

## ✅ What's Already Done
- ✅ Backend `.env` file created with your API key
- ✅ Backend dependencies installed
- ✅ Frontend integration code ready

## 📝 What You Need to Do Now

### Step 1: Add Your Custom GPT System Prompt

1. Open your Custom GPT in ChatGPT
2. Click on the GPT name → **"Edit GPT"**
3. Find the **"Instructions"** or **"System Prompt"** section
4. **Copy the entire prompt text**
5. Open `sense-backend/.env` file
6. Replace the `SYSTEM_PROMPT` line with your actual prompt:

```env
SYSTEM_PROMPT="Your actual Custom GPT system prompt here"
```

**Important:** Keep the quotes around the prompt if it contains multiple lines or special characters.

### Step 2: Set Up Frontend Environment

Create `.env.local` in the root directory:

```bash
# In the root directory (not sense-backend)
cp .env.local.example .env.local
```

Or manually create `.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Step 3: Start the Backend

```bash
cd sense-backend
npm run dev
```

You should see: `🚀 Sense backend listening on port 8080`

### Step 4: Start the Frontend

In a new terminal (in the root directory):

```bash
npm run dev
```

### Step 5: Test It!

1. Open `http://localhost:3000/neural`
2. You should see "● Connected" in the chat header
3. Send a message to test!

## 🔧 Optional: Change the Model

If you want to use a different OpenAI model, edit `sense-backend/.env`:

```env
OPENAI_MODEL=gpt-4o        # or gpt-4-turbo, gpt-4, etc.
```

Available models:
- `gpt-4o-mini` (cheapest, fastest)
- `gpt-4o` (balanced)
- `gpt-4-turbo` (more capable)
- `gpt-4` (most capable)

## 🐛 Troubleshooting

**Backend won't start:**
- Check that `.env` file exists in `sense-backend/` directory
- Verify `OPENAI_API_KEY` is set correctly

**Frontend shows "Connection Error":**
- Make sure backend is running (`npm run dev` in `sense-backend/`)
- Check that `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL
- Check browser console for errors

**API errors:**
- Verify your API key is valid
- Check your OpenAI account has credits
- Make sure the model name is correct

## 🎉 You're All Set!

Once you add your system prompt and start both servers, your Custom GPT will be integrated into the neural page!

