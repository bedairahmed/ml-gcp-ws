# 🧠 Lab 1 Quiz — Explore Your Cloud

**5 quick questions.** Click to reveal the answer.

---

### Q1. You found `madina-lab-vpc` in Console. What IP range does its subnet use?

<details>
<summary>💡 Answer</summary>

**10.10.0.0/24** — that's 256 IP addresses in the `madina-lab-subnet`.

</details>

---

### Q2. You opened Secret Manager. Can students see the actual secret values?

<details>
<summary>💡 Answer</summary>

**No** — students have read-only access. Only the Cloud Build service account can access secret values at build time. This is how Requirement #2 (no hardcoded secrets) is enforced.

</details>

---

### Q3. The Dockerfile has two stages. Why not just one?

<details>
<summary>💡 Answer</summary>

**To keep the final image small.** Stage 1 uses Node.js (~200MB) to build the app. Stage 2 copies only the built files into nginx (~25MB). The final image is ~25MB instead of ~500MB.

</details>

---

### Q4. In Cloud Run, the instructor's service shows `min-instances: 0`. What does that mean?

<details>
<summary>💡 Answer</summary>

**Scale to zero** — when nobody is using the app, Cloud Run shuts down all instances. Cost = $0 when idle. This is Requirement #5.

</details>

---

### Q5. The pipeline has 7 steps. Which two are security scans?

<details>
<summary>💡 Answer</summary>

**Step 1 (Hadolint)** scans the Dockerfile for best practices. **Step 3 (Trivy)** scans the built container image for known vulnerabilities (CVEs). This is Requirement #3 — scan before deploy.

</details>

---

[← Back to Lab 1](../lab1.md) · [→ Start Lab 2](../lab2.md)