# 🔀 Git — Quick Reference

## Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

## Clone & Start

```bash
git clone https://github.com/user/repo.git    # Download repo
cd repo                                         # Enter folder
```

## Daily Workflow

```bash
git status                    # What's changed?
git add .                     # Stage all changes
git add file.txt              # Stage one file
git commit -m "message"       # Save changes locally
git push                      # Upload to GitHub
git pull                      # Download latest from GitHub
```

## Branches

```bash
git branch                    # List branches
git branch feature-x          # Create branch
git checkout feature-x        # Switch to branch
git checkout -b feature-x     # Create + switch (shortcut)
git merge feature-x           # Merge into current branch
git branch -d feature-x       # Delete branch
```

## View History

```bash
git log                       # Full log
git log --oneline             # Compact log
git log --oneline -5          # Last 5 commits
git diff                      # Unstaged changes
git diff --staged             # Staged changes
```

## Undo

```bash
git checkout -- file.txt      # Discard unstaged changes
git reset HEAD file.txt       # Unstage a file
git reset --soft HEAD~1       # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (lose changes)
```

## Remote

```bash
git remote -v                 # Show remote URLs
git fetch                     # Download changes (don't merge)
git pull                      # Download + merge
git push origin main          # Push to specific branch
```

## Workshop Commands

```bash
# Clone the workshop repo
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws

# Check what's in the repo
ls -la

# If you made changes and want to reset
git checkout -- .
```

## .gitignore

```bash
# Common entries
.env                # Never commit secrets
node_modules/       # Dependencies (npm install recreates)
dist/               # Build output
.terraform/         # Terraform providers
*.tfstate           # Terraform state (sensitive)
```