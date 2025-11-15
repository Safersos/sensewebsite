# Fixing Git History - Removing API Key

GitHub detected your API key in the commit history. Here's how to fix it:

## ⚠️ IMPORTANT: Your API Key Was Exposed

Your API key was committed to git history. You should:
1. **Rotate your API key** at https://platform.openai.com/api-keys (revoke the old one and create a new one)
2. Clean up the git history (instructions below)

## Option 1: Amend the Last Commit (Easiest)

If the API key is only in the most recent commit:

```bash
# Stage the fixed files
git add sense-backend/create-env.js sense-backend/setup-env.js

# Amend the last commit
git commit --amend --no-edit

# Force push (since we're rewriting history)
git push origin main --force
```

**⚠️ Warning:** Force pushing rewrites history. Only do this if you're the only one working on this branch.

## Option 2: Interactive Rebase (If key is in older commits)

```bash
# Find the commit hash with the secret (from GitHub's error message)
# Commit: 5fb3b92e0928d7f5b18b1a6710c79fd70aad5990

# Start interactive rebase from before that commit
git rebase -i 5fb3b92e0928d7f5b18b1a6710c79fd70aad5990^1

# In the editor, change "pick" to "edit" for the commit with the secret
# Save and close

# The commit will be paused, now fix the files:
git add sense-backend/create-env.js sense-backend/setup-env.js
git commit --amend --no-edit

# Continue the rebase
git rebase --continue

# Force push
git push origin main --force
```

## Option 3: Use BFG Repo-Cleaner (Best for multiple commits)

1. Download BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Create a file `keys.txt` with your API key:
   ```
   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
   ```
3. Run:
   ```bash
   java -jar bfg.jar --replace-text keys.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin main --force
   ```

## Option 4: Create New Commit (Simplest, but key stays in history)

Just commit the fixed files and push:

```bash
git add sense-backend/create-env.js sense-backend/setup-env.js
git commit -m "Remove API key from setup scripts"
git push origin main
```

**Note:** This doesn't remove the key from history, but GitHub will allow the push since the current commit doesn't have it.

## ✅ After Fixing

1. **Rotate your API key** - The old one is compromised
2. Update `sense-backend/.env` with your new API key
3. Make sure `.env` is in `.gitignore` (it already is)

## 🔒 Prevention

- ✅ `.env` files are already in `.gitignore`
- ✅ Setup scripts now use templates instead of real keys
- ❌ Never commit files with real API keys or secrets

