# AI DevOps Trends 2026 — What to Learn Now

**Vikram's reference:** Skills that appear in Hyderabad GCC JDs 2025-2026.
Updated monthly by the `trends_agent`. Last manual update: June 2026.

---

## Tier 1 — Already Hiring For (learn immediately)

### 1. Platform Engineering
- **What:** Internal Developer Platform (IDP) — give devs self-service infra
- **Tools:** Backstage (Spotify), Port, Cortex
- **Azure:** Azure Developer Center + Deployment Environments
- **Why it matters:** Every major GCC in Hyderabad (EY, Deloitte, HCL) is building IDPs
- **Learn path:** → Backstage plugin development → Azure Dev Center → golden paths
- **Interview Q:** "Design a self-service platform for 200 developers to spin up AKS namespaces with RBAC, quotas, and cost tags automatically"

### 2. GitOps with ArgoCD / Flux
- **What:** Git as single source of truth for Kubernetes state
- **Tools:** ArgoCD, Flux v2, Weave GitOps
- **Azure:** AKS + ACR + Azure Repos (GitOps bridge)
- **AWS equiv:** EKS + ECR + CodeCommit
- **Why it matters:** Every AKS production JD now lists ArgoCD
- **Learn path:** → Helm charts → ArgoCD App of Apps → ApplicationSets → Flux multi-tenancy
- **Hands-on:** Deploy ArgoCD to KodeKloud AKS, sync a sample app from Azure Repos

### 3. FinOps / Cloud Cost Engineering
- **What:** Unit economics — cost per pod, per feature, per customer
- **Tools:** OpenCost, Kubecost, Azure Cost Management + Budgets API
- **Why it matters:** GCCs are mandated to show ROI on cloud spend
- **Learn path:** → Kubecost on AKS → Azure Cost alerts + KQL → chargeback reports
- **Interview Q:** "AKS cluster costs ₹4L/month. How do you identify and reduce waste by 30%?"

### 4. Policy as Code
- **What:** Enforce governance rules in CI pipeline, not post-deploy
- **Tools:** OPA/Rego, Azure Policy, Gatekeeper, tfsec, Checkov
- **Azure:** Azure Policy Initiative + AKS Gatekeeper addon
- **Learn path:** → tfsec in Terraform pipeline → OPA Rego basics → Gatekeeper constraints
- **Already partial:** You ran tfsec in Phase 3 of your Playbook

---

## Tier 2 — Fast Growing (learn in next 3 months)

### 5. AI-Augmented DevOps (AIOps)
- **What:** LLMs embedded in the DevOps toolchain
- **Tools:** GitHub Copilot for IaC, Azure DevOps Copilot, Harness AI, Dynatrace Davis AI
- **Azure:** Azure Monitor Copilot (preview) — NL → KQL query generation
- **Real use cases:**
  - AI generates Terraform from architecture diagram
  - AI triages PagerDuty alerts → suggests runbook step
  - AI writes PR descriptions and release notes
- **Learn path:** → GitHub Copilot CLI → Azure Monitor Copilot → LangGraph tool use

### 6. eBPF-based Observability
- **What:** Kernel-level tracing without code changes — replaces many sidecar agents
- **Tools:** Cilium, Hubble, Pixie, Falco, Tetragon
- **Azure:** Cilium as AKS CNI (now GA in AKS 1.29+)
- **Why it matters:** eBPF is replacing traditional APM agents in cloud-native stacks
- **Learn path:** → Cilium CNI on AKS → Hubble UI for network viz → Tetragon for runtime security

### 7. Kubernetes Platform Engineering (beyond basics)
- **Advanced AKS topics now in JDs:**
  - Multi-cluster federation (Fleet Manager in Azure)
  - KEDA (event-driven autoscaling) — Azure Service Bus → pod scale
  - Dapr (Distributed Application Runtime) — sidecar for microservices
  - Crossplane — provision Azure infra from Kubernetes CRDs
  - Karpenter (node autoprovisioner — AKS preview)
- **Learn path:** → KEDA with Azure Service Bus → Dapr on AKS → Crossplane CRDs

### 8. Supply Chain Security (SLSA / SBOM)
- **What:** Secure the software build pipeline itself
- **Standards:** SLSA Level 1-3, SBOM (Software Bill of Materials)
- **Tools:** Sigstore/Cosign, Syft, Grype, GitHub Actions SLSA provenance
- **Azure:** Azure Container Registry content trust + Notation (CNCF)
- **JD trigger:** "Experience with supply chain security" appears in 40% of senior DevOps JDs
- **Learn path:** → Trivy SBOM scan → Cosign image signing → ACR Notation

---

## Tier 3 — Emerging (radar watch, learn in 6 months)

### 9. WebAssembly (WASM) for Edge/Cloud
- **What:** Run polyglot workloads in AKS without full container overhead
- **Tools:** Spin (Fermyon), SpinKube, WasmEdge
- **Azure:** AKS WASM node pool (preview) — runwasi runtime
- **Watch signal:** CNCF Sandbox → Incubating status for SpinKube

### 10. AI Inference on Kubernetes
- **What:** Run open-source LLMs on AKS GPU nodes
- **Tools:** vLLM, Ollama, Triton Inference Server, KServe
- **Azure:** AKS GPU node pools (NC-series) + Azure AI Foundry
- **Vikram relevance:** Your SevaFirst uses Llama 3.3 70B — the infra to serve it at scale is this
- **Learn path:** → AKS GPU node pool → vLLM deployment YAML → KServe CRD

### 11. Dagger (Portable CI/CD)
- **What:** Write CI/CD pipelines in code (Go/Python/TS), run anywhere
- **Tools:** Dagger.io
- **Azure:** Replaces azure-pipelines.yml with typed SDK calls
- **Watch signal:** Gaining traction in platform engineering teams in 2026

### 12. OpenTofu (Terraform fork)
- **What:** Open-source Terraform fork by OpenTF Foundation (post HashiCorp BSL license change)
- **Relevance:** Some GCCs mandating OpenTofu over Terraform for open-source compliance
- **Migration:** 95% compatible with Terraform HCL — add to your skill list alongside Terraform

---

## Certifications That Matter in Hyderabad GCC JDs (2026)

| Cert | Provider | Weight in JDs | Priority |
|---|---|---|---|
| AZ-104 Azure Administrator | Microsoft | High — baseline ask | Do first |
| AZ-400 Azure DevOps Engineer Expert | Microsoft | Very High — most JDs | Do second |
| CKA Certified Kubernetes Administrator | CNCF | High — AKS roles | Do third |
| AZ-305 Azure Solutions Architect | Microsoft | Medium — senior roles | Do fourth |
| HashiCorp Terraform Associate | HashiCorp | Medium | You're ready now |
| CKS Certified Kubernetes Security | CNCF | Low but differentiating | Do after CKA |
| AWS SAA (existing) | Amazon | Good for AWS→Azure narrative | Already have? |

---

## Weekly Trends Digest Format (auto-generated by trends_agent)

```
Week of [DATE] — Azure DevOps Trends Digest

🔵 Azure Updates
- [Azure Blog item 1]
- [Azure Blog item 2]

🟢 CNCF / Kubernetes
- [CNCF update]

🟡 Tools to Watch
- [New tool or version]

🔴 Hyderabad JD Signal
- Top 5 skills appearing in NEW Hyderabad cloud JDs this week
- Skill that appeared for the first time: [skill]
- Salary movement: [band] → [new band]

📚 Vikram's Focus This Week
- [Personalized recommendation based on gap analysis]
```

---

## AI DevOps Maturity Model (where to position yourself)

```
Level 1 — Script monkey
  Writes bash/YAML manually, no IaC

Level 2 — IaC practitioner  ← Vikram current
  Terraform + Bicep, CI/CD pipelines, Docker

Level 3 — Platform engineer  ← Target
  AKS production ops, GitOps, Policy as Code, FinOps

Level 4 — Platform architect
  IDP design, multi-cluster fleet, eBPF observability, AI-augmented DevOps

Level 5 — AI DevOps engineer
  LLMOps, AI inference infrastructure, AI-native CI/CD
```

---

## O2C (Oil-to-Chemical) Specific DevOps Context

For your Reliance project context and interview narratives:

- **Scale:** SAP S/4HANA integration → 500+ microservices, 3 AKS clusters
- **Compliance:** ISO 27001, SOC 2 — drives Policy as Code and supply chain security
- **Data residency:** India region requirement → Azure Central India primary
- **Latency:** OT/IT convergence → sub-100ms for process control APIs
- **Relevant JD phrases to use:**
  - "Managed AKS clusters supporting SAP HANA procurement integration"
  - "Implemented Key Vault CSI driver for secrets management in O2C pipeline"
  - "Designed Terraform modules for multi-environment AKS provisioning at Reliance scale"
