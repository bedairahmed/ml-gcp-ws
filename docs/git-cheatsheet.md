# 🔀 Git — Quick Reference

# 🔀 Git — Quick Reference

## Initial Setup

```bash
git config --global user.name "Your Name"                   # Set your name globally
git config --global user.email "your@email.com"             # Set email globally
git config --global core.editor "vim"                       # Set default editor
git config --list                                           # View all configuration
git config --global --list                                  # View global config only
```
> Configure Git identity. This information is attached to every commit you make. Use `--global` for all projects or omit it for current project only.

## Clone & Initialize

```bash
git clone https://github.com/user/repo.git                  # Clone full repository
git clone https://github.com/user/repo.git my-folder        # Clone into specific folder
git clone --depth=1 https://github.com/user/repo.git        # Shallow clone (faster)
cd repo                                                      # Navigate to cloned repo
git init                                                     # Initialize new repo locally
```
> **Clone:** Downloads existing repository. **Init:** Creates new repository in current folder.

## Daily Workflow

```bash
git status                              # Show modified, staged, and untracked files
git add .                               # Stage all changes in current directory
git add file.txt                        # Stage specific file
git add *.js                            # Stage files matching pattern
git commit -m "Clear message here"      # Commit staged changes with message
git commit -am "message"                # Stage all tracked files + commit (skip git add)
git push                                # Upload commits to remote branch
git push origin main                    # Push to specific remote and branch
git pull                                # Fetch + merge latest changes from remote
git fetch                               # Download changes without merging
```
> **Workflow:** Status → Add → Commit → Push. **Pull:** Gets latest changes. **Fetch:** Downloads without auto-merging.

## Branches

```bash
git branch                                  # List local branches
git branch -a                               # List all branches (local + remote)
git branch feature-x                        # Create new branch
git branch -d feature-x                     # Delete branch (safe)
git branch -D feature-x                     # Force delete branch
git branch -m old-name new-name             # Rename branch
git checkout feature-x                      # Switch to branch
git checkout -b feature-x                   # Create + switch to new branch (shortcut)
git switch feature-x                        # Modern way to switch branches (Git 2.23+)
git merge feature-x                         # Merge feature-x into current branch
git merge --no-ff feature-x                 # Merge with merge commit (preserves history)
git merge --squash feature-x                # Squash commits before merging
```
> **Branches:** Parallel development lines. Create feature branches from main, merge back when done. Always merge to main on GitHub via Pull Requests, not locally.

## View History

```bash
git log                                     # Full commit history with details
git log --oneline                           # Compact view (one line per commit)
git log --oneline -5                        # Last 5 commits only
git log --oneline --graph --all             # Visual branch structure
git log --author="Name"                     # Filter by author
git log --since="2 weeks ago"               # Filter by date
git show COMMIT_HASH                        # Show specific commit details
git diff                                    # Unstaged changes (working vs staged)
git diff --staged                           # Staged changes (staged vs last commit)
git diff branch1 branch2                    # Compare two branches
git blame file.txt                          # Show who changed each line
```
> **Log:** Commit history. **Diff:** Compare changes. **Blame:** Track who changed what line and when.

## Undo & Fix

```bash
git checkout -- file.txt                    # Discard unstaged changes in file
git checkout -- .                           # Discard all unstaged changes
git reset HEAD file.txt                     # Unstage a file (keep changes)
git reset HEAD~1                            # Undo last commit (default: soft)
git reset --soft HEAD~1                     # Undo commit, keep changes staged
git reset --mixed HEAD~1                    # Undo commit, keep changes unstaged (default)
git reset --hard HEAD~1                     # Undo commit, discard all changes
git revert COMMIT_HASH                      # Create new commit that reverses changes (safe)
git clean -fd                               # Remove untracked files and directories
```
> **Reset:** Rewrites history (use locally). **Revert:** Creates undo commit (use on shared branches). **Checkout:** Discards changes.

## Remote Management

```bash
git remote -v                               # Show remote URLs (fetch + push)
git remote add origin https://github.com/user/repo.git  # Add new remote
git remote remove origin                    # Remove remote
git remote rename old new                   # Rename remote
git fetch                                   # Download changes (don't merge)
git fetch origin                            # Fetch from specific remote
git pull                                    # Fetch + merge (combines fetch + merge)
git pull --rebase                           # Fetch + rebase instead of merge
git push origin main                        # Push to remote and specific branch
git push origin --all                       # Push all branches
git push origin --tags                      # Push all tags
git push origin feature-x --force            # Force push (use with caution!)
git push origin --delete feature-x          # Delete remote branch
```
> **Fetch:** Downloads without changing your code. **Pull:** Downloads and merges. **Push:** Uploads your commits.

## Stash (Temporary Save)

```bash
git stash                                   # Save uncommitted changes temporarily
git stash list                              # List all stashes
git stash pop                               # Restore latest stash and remove it
git stash apply                             # Restore latest stash (keep it)
git stash apply stash@{0}                   # Apply specific stash by number
git stash drop stash@{0}                    # Delete specific stash
git stash clear                             # Delete all stashes
```
> **Stash:** Temporarily save work without committing. Useful when switching branches with uncommitted changes.

## Tags (Releases)

```bash
git tag                                     # List all tags
git tag v1.0.0                              # Create lightweight tag
git tag -a v1.0.0 -m "Version 1.0"         # Create annotated tag with message
git show v1.0.0                             # Show tag details
git push origin v1.0.0                      # Push specific tag
git push origin --tags                      # Push all tags
git tag -d v1.0.0                           # Delete local tag
git push origin --delete v1.0.0             # Delete remote tag
```
> **Tags:** Mark specific points (usually releases). Immutable reference to commits.

## Workflow Examples

### Feature Branch Workflow (Best Practice)
```bash
# Create feature branch
git checkout -b feature/user-auth
git add .
git commit -m "Add user authentication"
git push origin feature/user-auth

# On GitHub: Create Pull Request, get review, merge to main

# Update main locally
git checkout main
git pull
```

### Workshop Setup
```bash
# Clone the workshop repo
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws

# Check what's in the repo
ls -la

# If you made changes and want to reset
git checkout -- .
git status                                  # Verify clean state
```

### Fix Mistakes
```bash
# Oops! Committed to wrong branch
git log --oneline -3                        # Find commit hash
git reset --hard HEAD~1                     # Undo last commit
git checkout correct-branch
git cherry-pick COMMIT_HASH                 # Re-apply to correct branch
```

## .gitignore

```bash
# Never commit secrets
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json

# Build outputs
dist/
build/
out/
.next/

# IDE & editor
.vscode/
.idea/
*.swp
*.swo
*~

# Cloud & Infrastructure
.terraform/
*.tfstate
*.tfstate.*
*.tfvars
!terraform.tfvars.example

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db
```
> Add files to `.gitignore` to prevent accidental commits of sensitive data, build artifacts, and temporary files.

## Tips & Best Practices

### Commit Messages
```bash
# Good commit message (present tense, descriptive)
git commit -m "Add user authentication feature"

# Bad commit message (vague)
git commit -m "fix"

# Multi-line commit message (opens editor)
git commit
# Line 1: Short summary (50 chars)
# Blank line
# Line 3+: Detailed explanation (wrap at 72 chars)
```

### Branch Naming
```
feature/feature-name       # New feature
bugfix/bug-name           # Bug fix
hotfix/issue-name         # Urgent production fix
docs/documentation-change # Documentation
refactor/code-area        # Code refactoring
```

### Golden Rules
- ✅ **Pull before pushing** → Avoid conflicts: `git pull` before `git push`
- ✅ **Commit often** → Small, logical commits are easier to review
- ✅ **Use branches** → Never work directly on main
- ✅ **Write clear messages** → Future you will thank present you
- ✅ **Review before pushing** → `git diff` to check your changes
- ❌ **Never force push to main** → Can destroy team's work
- ❌ **Don't commit secrets** → Use `.gitignore` and `.env` files