# Clean Up Git History - Remove API Keys

GitHub is blocking your push because the old API key is in these commits:
- `5fb3b92` - has key in `create-env.js` and `setup-env.js`
- `91532e2` - has key in `FIX_GIT_HISTORY.md` (just fixed)

## Quick Fix: Interactive Rebase

Run these commands to clean up the history:

```bash
# Start interactive rebase from before the problematic commits
git rebase -i 5fb3b92^1

# In the editor that opens:
# 1. Find commit 5fb3b92 - change "pick" to "edit"
# 2. Find commit 91532e2 - change "pick" to "edit"  
# 3. Save and close

# Git will pause at 5fb3b92, fix the files:
git add sense-backend/create-env.js sense-backend/setup-env.js
git commit --amend --no-edit
git rebase --continue

# Git will pause at 91532e2, fix the file:
git add FIX_GIT_HISTORY.md
git commit --amend --no-edit
git rebase --continue

# Force push (rewrites history)
git push origin main --force
```

## Alternative: Simpler Approach

If rebase is too complex, you can just delete the FIX_GIT_HISTORY.md file and try pushing:

```bash
git rm FIX_GIT_HISTORY.md
git commit -m "Remove FIX_GIT_HISTORY.md with exposed key"
git push origin main
```

But you'll still need to clean up commit 5fb3b92.

## Easiest: Start Fresh Branch

If you're okay with losing the old commits:

```bash
# Create a new branch from current state
git checkout -b main-clean

# Force push the clean branch
git push origin main-clean --force

# Then in GitHub, set main-clean as default branch
# Or merge it back to main after cleaning
```

