# Setting Up Subdomain on Vercel

## Configure `backend.sensewearable.com` for Your Backend

### Step 1: Add Custom Domain in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `backend.sensewearable.com`
5. Click **Add**

### Step 2: Configure DNS

Vercel will show you DNS records to add. You need to add a **CNAME record**:

**In your DNS provider (where sensewearable.com is managed):**

```
Type: CNAME
Name: backend
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
```

**OR if Vercel gives you a specific value, use that instead.**

### Step 3: Update Environment Variables

In Vercel dashboard → Settings → Environment Variables:

1. Set `FRONTEND_URL` to: `https://sensewearable.com`
2. Make sure all other env vars are set:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `SYSTEM_PROMPT`

### Step 4: Update Frontend

Update your frontend `.env.local` (or Vercel environment variables):

```env
NEXT_PUBLIC_API_URL=https://backend.sensewearable.com
```

### Step 5: Wait for DNS Propagation

DNS changes can take a few minutes to a few hours. Vercel will show the status in the dashboard.

### Step 6: Test

Once DNS is propagated:
- Test: `https://backend.sensewearable.com/health`
- Should return: `{"status":"ok","timestamp":"..."}`

---

## Alternative: Use Vercel's Default Domain

If you don't want to set up a subdomain right now, you can use Vercel's default domain:
- `your-project-name.vercel.app`

Just update `NEXT_PUBLIC_API_URL` in your frontend to point to that URL.

