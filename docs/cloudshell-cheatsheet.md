# 🖥️ Cloud Shell — Quick Reference

## What is Cloud Shell?

Cloud Shell is a **free browser-based terminal** built into the GCP Console. It comes pre-installed with `gcloud`, `docker`, `terraform`, `git`, `kubectl`, and more — no setup needed.

- **Machine:** Small Linux VM (Debian-based)
- **Disk:** 5GB persistent home directory (`$HOME`)
- **Session timeout:** 20 minutes of inactivity (your files stay)
- **Cost:** Free!

> Your `$HOME` directory persists across sessions. Anything outside `$HOME` resets when the VM restarts.

## Open Cloud Shell

| Method | How |
|--------|-----|
| Console button | Click **Activate Cloud Shell** (terminal icon) top-right of Console |
| Direct URL | [shell.cloud.google.com](https://shell.cloud.google.com) |

> First launch takes ~30 seconds. After that it's instant.

## Terminal Basics

```bash
# Where am I?
pwd                                    # Print current directory
ls                                     # List files
ls -la                                 # List all files (including hidden)

# Navigate
cd folder-name                         # Go into folder
cd ..                                  # Go up one level
cd ~                                   # Go to home directory

# Create & edit
mkdir my-folder                        # Create folder
touch file.txt                         # Create empty file
nano file.txt                          # Edit file (simple editor)
cat file.txt                           # View file contents
less file.txt                          # View long file (scroll with arrows, q to quit)

# Copy, move, delete
cp file.txt backup.txt                 # Copy file
cp -r folder/ backup/                  # Copy folder
mv old-name.txt new-name.txt           # Rename or move
rm file.txt                            # Delete file
rm -r folder/                          # Delete folder

# Search
grep "text" file.txt                   # Find text in file
grep -r "text" .                       # Find text in all files
find . -name "*.yaml"                  # Find files by name
```

> **Ctrl+C** = cancel running command. **Ctrl+L** = clear screen. **Tab** = autocomplete.

## Cloud Shell Editor

```bash
# Open the built-in code editor
cloudshell edit file.txt               # Open specific file
cloudshell edit .                      # Open current directory
```

Or click **Open Editor** (pencil icon) at the top of Cloud Shell.

| Action | Shortcut |
|--------|----------|
| Save | `Ctrl+S` |
| Find | `Ctrl+F` |
| Open terminal | `Ctrl+\`` |
| Toggle editor/terminal | Click **Open Editor** / **Open Terminal** |

> The editor is a lightweight VS Code. Good for browsing files and quick edits.

## Clone & Work with Repos

```bash
# Clone workshop repo
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws

# See what's inside
ls -la

# Reset if you broke something
git checkout -- .
git status                             # Should show "nothing to commit"
```

## Check Your Environment

```bash
# Who am I?
gcloud config get-value account        # Current logged-in account
gcloud config get-value project        # Current project

# Set project (if not set)
gcloud config set project ml-gcp-workshop-487117

# Verify tools are installed
gcloud version                         # Google Cloud CLI
terraform version                      # Terraform
docker version                         # Docker
git version                            # Git
node --version                         # Node.js
```

## Upload & Download Files

```bash
# Upload file from your laptop to Cloud Shell
# Click ⋮ (three dots menu) → Upload → Select file
# File lands in $HOME

# Download file from Cloud Shell to your laptop
cloudshell download file.txt
# Or: ⋮ → Download → Enter path
```

## Useful Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel running command |
| `Ctrl+L` | Clear screen |
| `Ctrl+D` | Exit / close terminal |
| `Ctrl+R` | Search command history |
| `Tab` | Autocomplete command or filename |
| `↑` / `↓` | Scroll through previous commands |
| `history` | Show all previous commands |
| `!!` | Re-run last command |

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Session disconnected | 20 min idle timeout | Reconnect — files are still there |
| `command not found` | Tool not installed | Most tools are pre-installed. Try `which TOOL` |
| Wrong project | Project not set | `gcloud config set project PROJECT_ID` |
| Permission denied | Wrong account | `gcloud auth list` then `gcloud config set account EMAIL` |
| Files disappeared | Saved outside `$HOME` | Only `$HOME` persists. Re-clone the repo |
| Editor won't open | Pop-up blocked | Allow pop-ups for `shell.cloud.google.com` |
| Slow terminal | Heavy build running | Wait for build to finish, or open a new tab |

## Workshop Quick Start

```bash
# 1. Open Cloud Shell
# 2. Clone the repo
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws

# 3. Verify your setup
gcloud config get-value project        # Should show: ml-gcp-workshop-487117
gcloud config get-value account        # Should show: your workshop email

# 4. You're ready! Follow the lab guide.
```