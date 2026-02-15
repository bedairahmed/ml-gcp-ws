# 🧠 Lab 3 Quiz — Infrastructure as Code

**5 quick questions.** Click to reveal the answer.

---

### Q1. Lab 2 used `gcloud run deploy`. Lab 3 used `terraform apply`. Same result — what's the difference?

<details>
<summary>💡 Answer</summary>

**Lab 2 is imperative** — "do these steps in order." **Lab 3 is declarative** — "make it look like this." Terraform tracks state, detects drift, and can scale to 50 deployments with one variable change.

</details>

---

### Q2. The pipeline builds the Docker image BEFORE running Terraform. Why?

<details>
<summary>💡 Answer</summary>

**Because `cloud_run.tf` references the image.** Terraform's Cloud Run resource needs the image to already exist in Artifact Registry. If you run `terraform apply` without the image, it fails.

</details>

---

### Q3. Checkov flagged your Terraform code. What does Checkov check?

<details>
<summary>💡 Answer</summary>

**Infrastructure security.** Checkov scans `.tf` files for misconfigurations — like public access without authentication, missing encryption, or overly permissive IAM roles. It's the Terraform equivalent of what Trivy does for containers.

</details>

---

### Q4. Each team's Terraform state is stored separately. Why does that matter?

<details>
<summary>💡 Answer</summary>

**So teams can't break each other's infrastructure.** Each team's state lives at `gs://...tfstate/terraform/state/team1/`. If team1 runs `terraform destroy`, it only affects team1's resources. This is set by `-backend-config="prefix=terraform/state/${_TEAM}"`.

</details>

---

### Q5. After Lab 3, someone manually changes your Cloud Run memory to 512Mi in Console. You run `terraform apply` again. What happens?

<details>
<summary>💡 Answer</summary>

**Terraform changes it back to 256Mi.** This is called **drift detection** — Terraform compares the actual state to your `.tf` files and enforces what the code says. That's the whole point of IaC: code is the source of truth.

</details>

---

[← Back to Lab 3](../lab3.md) · [📋 Submit Workshop Feedback](https://github.com/bedairahmed/ml-gcp-ws/issues/new?template=workshop-feedback.yml)