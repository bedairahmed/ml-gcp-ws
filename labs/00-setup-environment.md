# Lab 00: Setup Environment

⏱️ **Duration:** 15 minutes  
📋 **Objective:** Clone the repository, install dependencies, and verify your development environment.

---

## 🎯 Learning Outcomes

- [ ] Git clone a repository
- [ ] Install Node.js dependencies
- [ ] Verify all required tools are installed

---

## Step 1: Verify Tools

Open your terminal and verify each tool is installed:

```bash
# Git
git --version
# Expected: git version 2.x.x

# Node.js (20+)
node --version
# Expected: v20.x.x or higher

# npm
npm --version
# Expected: 10.x.x or higher

# Docker
docker --version
# Expected: Docker version 24.x.x or higher

# Google Cloud SDK
gcloud --version
# Expected: Google Cloud SDK x.x.x

# Terraform
terraform --version
# Expected: Terraform v1.x.x
```

> ⚠️ If any tool is missing, refer to the [Prerequisites](../README.md#-prerequisites) section.

---

## Step 2: Clone the Repository

```bash
# Clone the repo
git clone <REPO_URL_PROVIDED_BY_INSTRUCTOR>
cd madina-lab
```

---

## Step 3: Install Dependencies

```bash
npm install
```

You should see packages being downloaded. This may take 1-2 minutes.

---

## Step 4: Start the Dev Server

```bash
npm run dev
```

Open your browser and navigate to **http://localhost:8080**

You should see the Madina Lab landing page! 🎉

> 💡 The app will show a Firebase config warning in the console — that's expected. We'll configure Firebase in Lab 02.

---

## Step 5: Explore the Project Structure

```bash
# List the project structure
ls -la

# Key files to note:
# - Dockerfile          → Container build instructions
# - docker-compose.yml  → Local Docker development
# - cloudbuild.yaml     → GCP CI/CD pipeline
# - firestore.rules     → Database security rules
# - terraform/          → Infrastructure as Code
# - src/                → Application source code
```

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] All tools installed and working
- [ ] Repository cloned successfully
- [ ] `npm install` completed without errors
- [ ] App running at http://localhost:8080
- [ ] You can see the landing page in your browser

---

## 🔗 Next Lab

➡️ [Lab 01: Explore the App](./01-explore-the-app.md)
