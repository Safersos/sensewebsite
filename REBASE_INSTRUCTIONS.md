# Interactive Rebase - Step by Step

## Step 1: Start Interactive Rebase

```bash
git rebase -i 5fb3b92^1
```

This will open an editor with a list of commits.

## Step 2: Edit the Commits

In the editor, you'll see something like:

```
pick 5fb3b92 x
pick 91532e2 cx
pick dfb8bf8 Remove API key from setup scripts - use template instead
...
```

**Change it to:**

```
edit 5fb3b92 x
edit 91532e2 cx
pick dfb8bf8 Remove API key from setup scripts - use template instead
...
```

Change `pick` to `edit` for commits `5fb3b92` and `91532e2`.

Save and close the editor.

## Step 3: Fix Commit 5fb3b92

Git will pause and show:
```
Stopped at 5fb3b92... x
You can amend the commit now...
```

Run these commands:

```bash
# The files should already be fixed, but let's make sure
git add sense-backend/create-env.js sense-backend/setup-env.js
git commit --amend --no-edit
git rebase --continue
```

## Step 4: Fix Commit 91532e2

Git will pause again. Run:

```bash
git add FIX_GIT_HISTORY.md
git commit --amend --no-edit
git rebase --continue
```

## Step 5: Push

After rebase completes:

```bash
git push origin main --force
```

⚠️ **WARNING:** Force push rewrites history. Only do this if you're the only one working on this branch!

