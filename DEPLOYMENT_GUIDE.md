# Deployment Guide - Sense Backend

Your backend is a separate Express.js server that needs to be deployed independently from your Next.js frontend.

## 🎯 Deployment Options

### Option 1: Vercel (Serverless Functions) ⚡

**Pros:** Same platform as frontend, easy integration, free tier
**Cons:** Need to adapt Express app to serverless functions

#### Steps:

1. **Create `vercel.json` in `sense-backend/`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. **Install Vercel CLI:**
```bash
npm i -g vercel
```

3. **Deploy:**
```bash
cd sense-backend
vercel
```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add:
     - `OPENAI_API_KEY` (your API key)
     - `OPENAI_MODEL` (e.g., `gpt-4o-mini`)
     - `SYSTEM_PROMPT` (your Custom GPT prompt)
     - `FRONTEND_URL` (your frontend URL, e.g., `https://your-site.vercel.app`)

5. **Update Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

---

### Option 2: Render (Easiest for Express) 🚀

**Pros:** Perfect for Express apps, free tier, easy setup
**Cons:** Separate platform from frontend

#### Steps:

1. **Go to:** https://render.com
2. **Create New → Web Service**
3. **Connect your GitHub repo**
4. **Settings:**
   - **Root Directory:** `sense-backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

5. **Add Environment Variables:**
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `SYSTEM_PROMPT`
   - `FRONTEND_URL` (your Vercel frontend URL)

6. **Deploy!**

7. **Update Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

### Option 3: Railway 🚂

**Pros:** Simple, good free tier, auto-deploys from GitHub
**Cons:** Separate platform

#### Steps:

1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo
4. Set root directory to `sense-backend`
5. Add environment variables
6. Deploy!

---

### Option 4: Fly.io ✈️

**Pros:** Global edge deployment, good performance
**Cons:** More complex setup

---

## 🔧 Production Checklist

### Before Deploying:

- [ ] Set `FRONTEND_URL` to your actual frontend domain
- [ ] Set `AUTH_KEY` for API security (optional but recommended)
- [ ] Update CORS in `server.js` to allow your frontend domain
- [ ] Test locally with production-like settings

### Environment Variables to Set:

```env
PORT=8080  # (or let platform assign)
OPENAI_API_KEY=sk-proj-...  # Your API key
OPENAI_MODEL=gpt-4o-mini
SYSTEM_PROMPT="Your Custom GPT prompt here"
FRONTEND_URL=https://your-frontend.vercel.app
AUTH_KEY=some-secret-key  # Optional but recommended
```

### Update CORS in `server.js`:

Change this line:
```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
```

To:
```javascript
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://your-frontend.vercel.app';
```

---

## 🎯 Recommended Setup

**For your case (Next.js frontend on Vercel):**

1. **Frontend:** Deploy on Vercel (already set up)
2. **Backend:** Deploy on **Render** (easiest for Express) or **Railway**

**Why not Vercel for backend?**
- Your Express app would need to be converted to serverless functions
- Render/Railway are simpler for traditional Express apps

---

## 📝 Quick Deploy to Render

1. **Create `render.yaml` in `sense-backend/`:**

```yaml
services:
  - type: web
    name: sense-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: OPENAI_MODEL
        value: gpt-4o-mini
      - key: FRONTEND_URL
        sync: false
```

2. **Push to GitHub**
3. **Connect Render to your repo**
4. **Set environment variables in Render dashboard**
5. **Deploy!**

---

## 🔗 After Deployment

1. **Get your backend URL** (e.g., `https://sense-backend.onrender.com`)
2. **Update frontend `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=https://sense-backend.onrender.com
   ```
3. **Redeploy frontend on Vercel**
4. **Test the integration!**

---

## 🐛 Troubleshooting

**CORS Errors:**
- Make sure `FRONTEND_URL` is set correctly
- Check that your frontend URL matches exactly (including `https://`)

**API Not Working:**
- Check backend logs
- Verify environment variables are set
- Test backend health endpoint: `https://your-backend.com/health`

**Rate Limiting:**
- Adjust rate limits in `server.js` if needed
- Consider adding Redis for production session storage

