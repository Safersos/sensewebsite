# Vercel Environment Variables Setup

## Required Environment Variables

Add these in your Vercel project dashboard:

### Go to: Project → Settings → Environment Variables

1. **OPENAI_API_KEY**
   - Value: `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`
   - Environment: Production, Preview, Development

2. **OPENAI_MODEL**
   - Value: `gpt-4o-mini`
   - Environment: Production, Preview, Development

3. **SYSTEM_PROMPT**
   - Value: (Your Custom GPT system prompt - paste it here)
   - Environment: Production, Preview, Development
   - ⚠️ If it has multiple lines, wrap in quotes

4. **FRONTEND_URL**
   - Value: `https://sensewearable.com`
   - Environment: Production, Preview, Development

5. **AUTH_KEY** (Optional but recommended)
   - Value: (Generate a random secret key)
   - Environment: Production, Preview, Development

## After Adding Variables

1. **Redeploy** your backend (Vercel will auto-redeploy or trigger manually)
2. **Test** the endpoints:
   - `https://your-backend.vercel.app/health`
   - `https://your-backend.vercel.app/`

## Update Frontend

In your **frontend Vercel project**, add:

**NEXT_PUBLIC_API_URL**
- Value: `https://backend.sensewearable.com` (or your Vercel backend URL)
- Environment: Production, Preview, Development

Then redeploy your frontend.

