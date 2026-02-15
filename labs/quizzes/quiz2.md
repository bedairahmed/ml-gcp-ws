# 🧠 Lab 2 Quiz — Ship Your App

**5 quick questions.** Click to reveal the answer.

---

### Q1. You deployed with one command. What does `--substitutions=_TEAM=team1` do?

<details>
<summary>💡 Answer</summary>

**It sets the team variable** that the pipeline uses everywhere — service name (`madina-lab-team1`), service account (`team1-sa`), namespace (`team1`), and domain. One variable controls all the isolation.

</details>

---

### Q2. Trivy found some HIGH vulnerabilities. Did the build stop?

<details>
<summary>💡 Answer</summary>

**No** — the scan is set to `--exit-code 0` (non-blocking / warning only). The pipeline continues even if issues are found. To make it blocking, you'd change it to `--exit-code 1`.

</details>

---

### Q3. Where did you find the secrets mounted on your Cloud Run service?

<details>
<summary>💡 Answer</summary>

**Console → Cloud Run → madina-lab-teamN → Variables & Secrets tab.** The secrets are referenced from Secret Manager — you can see the secret names but not the values.

</details>

---

### Q4. Your team's app data is separate from the instructor's. How?

<details>
<summary>💡 Answer</summary>

**Namespace isolation.** The pipeline sets `VITE_NAMESPACE=team1` at build time. The app prefixes all Firestore collections — `team1_users`, `team1_events`, etc. — so each team's data is separate in the same database.

</details>

---

### Q5. If your app had a bug and you needed to go back to the previous version, how?

<details>
<summary>💡 Answer</summary>

**Cloud Run → Revisions tab → route traffic to a previous revision.** Cloud Run keeps every deployment as a revision. You can split traffic or roll back instantly — no rebuild needed.

</details>

---

[← Back to Lab 2](../lab2.md) · [→ Start Lab 3](../lab3.md)