#!/bin/bash
# Script to fix API keys in git history

echo "🔧 Fixing commits with API keys..."

# The old API key to replace (replace with your actual old key)
OLD_KEY="your-old-api-key-here"
NEW_KEY="your-api-key-here"

# Use git filter-branch to replace the key in all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch sense-backend/create-env.js sense-backend/setup-env.js FIX_GIT_HISTORY.md 2>/dev/null || true" \
  --prune-empty --tag-name-filter cat -- --all

echo "✅ Done! Now run: git push origin main --force"

