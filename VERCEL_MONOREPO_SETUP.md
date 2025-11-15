# Vercel Monorepo Setup - Separate Frontend & Backend Deployments

Since your frontend and backend are in the same repo, you need to configure Vercel to deploy them separately based on what files changed.

## Solution: Two Separate Vercel Projects

Create **two separate Vercel projects** from the same GitHub repository:

### Project 1: Frontend (sensewearable.com)

1. **In Vercel Dashboard:**
   - Create a new project (or use existing frontend project)
   - Connect to your GitHub repo
   - **Root Directory:** Leave empty (or `/`)
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

2. **Settings → Git:**
   - **Ignore Build Step:** Add this command:
   ```bash
   git diff --quiet HEAD^ HEAD sense-backend/
   ```
   This will **skip deployment** if only `sense-backend/` files changed.

3. **Settings → Environment Variables:**
   - `NEXT_PUBLIC_API_URL` = `https://backend.sensewearable.com`

### Project 2: Backend (backend.sensewearable.com)

1. **In Vercel Dashboard:**
   - Create a **new** project
   - Connect to the **same** GitHub repo
   - **Root Directory:** `sense-backend`
   - **Framework Preset:** Other
   - **Build Command:** (leave empty or `npm install`)
   - **Output Directory:** (leave empty)

2. **Settings → Git:**
   - **Ignore Build Step:** Add this command:
   ```bash
   git diff --quiet HEAD^ HEAD -- ':!sense-backend' ':!sense-backend/**'
   ```
   This will **skip deployment** if only files outside `sense-backend/` changed.

3. **Settings → Environment Variables:**
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `SYSTEM_PROMPT`
   - `FRONTEND_URL` = `https://sensewearable.com`

## How It Works

- **Frontend changes** (files in `src/`, `package.json`, etc.) → Only frontend deploys
- **Backend changes** (files in `sense-backend/`) → Only backend deploys
- **Both change** → Both deploy (which is fine)

## Alternative: Use Vercel CLI Configuration

You can also configure this via `vercel.json` files, but the Ignore Build Step in dashboard is easier.

## Testing

1. Make a change to `src/components/` → Only frontend should deploy
2. Make a change to `sense-backend/server.js` → Only backend should deploy
3. Check Vercel deployment logs to confirm

