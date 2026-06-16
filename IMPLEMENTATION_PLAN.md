# Azure DevOps Roadmap Pro
## Real-Time Learning Platform — Vikram Special Version
**Target:** Become a Production-Ready Azure DevOps / Platform Engineer in Hyderabad GCC Market
**Author Context:** 7+ yrs AWS → Azure transition | Jio Platforms | Deputy Manager – Cloud Engineer
**Last Updated:** June 2026

---

## PLATFORM VISION

Build a learning platform that answers one question every day:
> "What should I learn today to become a senior Azure DevOps Engineer in Hyderabad?"

Platform covers:
- Azure Fundamentals → Advanced
- DevOps Fundamentals → Enterprise DevOps
- Production Architecture Patterns
- Real-World Project Implementations (Jio/Reliance O2C context)
- Hands-On Labs (KodeKloud sandbox compatible)
- Interview Question Bank (Level 1–4)
- Job Description Gap Analyzer
- Hyderabad GCC Market Intelligence
- AI-Powered Mentor

---

## TARGET USERS

### Beginner
- Freshers entering cloud
- AWS Engineers moving to Azure (Vikram persona)
- System Administrators going cloud-native

### Intermediate
- Cloud Engineers
- DevOps Engineers
- Platform Engineers

### Advanced
- Azure Architects
- SRE Engineers
- Technical Leads

---

## CORE MODULE STRUCTURE

Every topic follows this 6-section pattern:

```
SECTION 1 → Theory          (What is it?)
SECTION 2 → Real World      (How Jio/Reliance uses it)
SECTION 3 → Production Arch (Enterprise design pattern)
SECTION 4 → Hands-On Lab    (KodeKloud sandbox steps)
SECTION 5 → Troubleshooting (Common failures + fixes)
SECTION 6 → Interview Q&A   (20 Basic + 20 Mid + 20 Advanced)
```

---

## LEARNING TRACKS

---

### TRACK 1 — Azure Fundamentals

**Goal:** Understand Azure as a platform before touching DevOps tooling.

| Module | Key Concepts |
|---|---|
| Azure Regions & Zones | Geography, latency, HA design |
| Resource Groups | Scope, lifecycle, tagging strategy |
| ARM / Bicep / Terraform | IaC foundations |
| Azure Portal | Navigation, cost alerts, resource locks |
| Azure CLI | az login, az group, az vm, az aks |
| Azure PowerShell | Alternative for Windows-heavy shops |
| Subscriptions & Tenants | Management Groups, billing scope |

**AWS→Azure Map (Vikram shortcut):**
```
AWS Account         → Azure Subscription
AWS Region          → Azure Region
AWS VPC             → Azure VNET
AWS IAM             → Azure Entra ID + RBAC
AWS CloudFormation  → Azure Bicep / ARM
AWS S3              → Azure Blob Storage
AWS EC2             → Azure VM
AWS EKS             → Azure AKS
AWS CloudWatch      → Azure Monitor + Log Analytics
AWS Secrets Manager → Azure Key Vault
```

---

### TRACK 2 — Azure Networking

**Goal:** Design production-grade network topologies used in GCC enterprises.

| Module | Key Concepts |
|---|---|
| VNET | Address space, subnets, peering |
| NSG | Inbound/outbound rules, flow logs |
| Route Tables | UDR, BGP, forced tunneling |
| DNS | Private DNS zones, custom resolvers |
| VPN Gateway | Site-to-site, P2P, BGP routing |
| ExpressRoute | Dedicated circuit, private peering |
| Azure Firewall | DNAT, SNAT, TLS inspection |
| Load Balancer | L4, Standard SKU, health probes |
| Application Gateway | L7, WAF, SSL termination |
| Front Door | Global CDN, failover, geo-routing |
| Private Endpoint | Service → VNET private IP binding |

**Production Pattern — Hub-Spoke (Enterprise Standard):**
```
[On-Premises / Jio DC]
        |
   [ExpressRoute / VPN]
        |
   [HUB VNET]
   ├── Azure Firewall
   ├── VPN Gateway
   ├── Private DNS Resolver
   └── Bastion Host
        |
   ┌────┼────┐
   |         |
[SPOKE 1]  [SPOKE 2]
 Dev/Test   Production
 AKS        AKS + DB
```

**Troubleshooting Checklist:**
- VM cannot reach internet → Check NSG outbound + Route Table UDR
- Peering not working → Check both-direction peering + allow-forwarded-traffic
- Private Endpoint DNS failing → Check private DNS zone link to VNET
- ExpressRoute packet loss → Check BGP health + circuit provider status

---

### TRACK 3 — Azure Compute

**Goal:** Run and scale workloads on Azure VMs and serverless compute.

| Module | Key Concepts |
|---|---|
| Virtual Machines | SKU selection, disks, extensions |
| VMSS | Autoscale rules, rolling upgrades |
| Availability Sets | Fault domains, update domains |
| Azure Functions | Serverless, triggers, bindings |
| App Service | PaaS web hosting, deployment slots |
| Container Instances | Quick-launch containers, no K8s needed |

**KodeKloud Lab Constraints (Vikram note):**
```
Allowed Regions : westus, eastus, centralus, southcentralus
No new RG creation : use existing RG
SKUs            : Standard_D2s_v3 max
RG name resets  : every ~3 hours
```

---

### TRACK 4 — Containers

**Goal:** Build, scan, and push production-grade container images.

| Module | Key Concepts |
|---|---|
| Docker Fundamentals | Dockerfile, layers, cache |
| Multi-Stage Builds | Build vs runtime separation |
| Image Security | Trivy scanning, rootless containers |
| ACR (Azure Container Registry) | Push/pull, geo-replication, webhooks |
| Container Networking | Bridge, host, overlay |
| Volumes & Storage | Bind mounts, named volumes |
| Secrets in Containers | BuildKit secrets, Key Vault integration |

**Production Dockerfile Pattern:**
```dockerfile
# Stage 1 - Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2 - Runtime (rootless)
FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app .
USER appuser
EXPOSE 3000
CMD ["node", "server.js"]
```

---

### TRACK 5 — Kubernetes / AKS

**Goal:** Deploy and operate production AKS clusters end-to-end.

| Module | Key Concepts |
|---|---|
| AKS Architecture | Control plane, node pools, kubelet |
| Pods & Deployments | replicas, rolling update, readiness probes |
| Services | ClusterIP, NodePort, LoadBalancer |
| Ingress | NGINX ingress, TLS, path routing |
| HPA | CPU/memory autoscaling |
| RBAC | ClusterRole, RoleBinding, ServiceAccount |
| Network Policies | Pod-to-pod traffic control |
| Key Vault CSI | Secrets injection without env vars |
| ACR Integration | System-assigned kubelet identity pull |

**Production AKS Architecture:**
```
[Internet]
    |
[Azure Front Door]
    |
[Application Gateway + WAF]
    |
[AKS Cluster - Private]
├── Ingress Controller (NGINX)
├── App Pods (Node Pool 1 - Standard_D4s_v3)
├── Worker Pods (Node Pool 2 - Standard_D8s_v3)
├── Key Vault CSI Driver
├── Azure Monitor Agent (DaemonSet)
└── ACR (System-assigned pull identity)
    |
[Azure SQL / Cosmos DB - Private Endpoint]
    |
[Azure Key Vault - Private Endpoint]
```

**KodeKloud AKS Constraints:**
```
Node pools  : 1 only
Node SKU    : Standard_D2s_v3
Node count  : max 2
Identity    : system-assigned (no user-assigned)
ACR pull    : kubelet identity attachment
```

**Daily Health Check (kubectl):**
```bash
kubectl get nodes                          # node status
kubectl get pods -A | grep -v Running      # non-running pods
kubectl top nodes                          # CPU/memory
kubectl get events --sort-by='.lastTimestamp' -A | tail -20
kubectl describe pod <failing-pod> -n <ns> # root cause
```

---

### TRACK 6 — DevOps

**Goal:** Build real CI/CD pipelines from code commit to production deployment.

| Module | Key Concepts |
|---|---|
| Git Fundamentals | branch, merge, rebase, cherry-pick |
| Gitflow vs Trunk-Based | When to use which |
| GitHub Actions | Workflows, secrets, matrix builds |
| Azure Repos | PR policies, branch protection |
| Azure Pipelines | YAML pipelines, stages, approvals |
| Release Management | Environments, gates, rollback |
| GitOps | ArgoCD / Flux patterns |

**Production azure-pipelines.yml Pattern:**
```yaml
trigger:
  branches:
    include: [main]

stages:

- stage: Build
  jobs:
  - job: BuildAndScan
    steps:
    - task: Docker@2
      inputs:
        command: buildAndPush
        repository: $(ACR_REPO)
        tags: $(Build.BuildId)
    - script: trivy image $(ACR_REPO):$(Build.BuildId)
      displayName: Security Scan

- stage: DeployDev
  dependsOn: Build
  environment: dev
  jobs:
  - deployment: DeployAKS
    strategy:
      runOnce:
        deploy:
          steps:
          - task: HelmDeploy@0

- stage: DeployProd
  dependsOn: DeployDev
  environment: production   # manual approval gate here
  jobs:
  - deployment: DeployProd
    strategy:
      runOnce:
        deploy:
          steps:
          - task: HelmDeploy@0
```

---

### TRACK 7 — Infrastructure as Code

**Goal:** Provision Azure infrastructure with Terraform (primary) and Bicep.

| Module | Key Concepts |
|---|---|
| Terraform Basics | providers, resources, variables, outputs |
| State Management | remote state in Azure Blob, locking |
| Modules | reusable components, versioning |
| Workspaces | dev/staging/prod environments |
| Lifecycle Rules | prevent_destroy, ignore_changes |
| Bicep | ARM alternative, shorter syntax |
| tfsec / Checkov | IaC security scanning |

**Critical Terraform Fix (azurerm v3):**
```hcl
provider "azurerm" {
  features {}
  skip_provider_registration = true  # Required on KodeKloud
}
```

**Production Module Pattern:**
```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── providers.tf
└── modules/
    ├── networking/
    ├── aks/
    ├── acr/
    └── keyvault/
```

---

### TRACK 8 — Observability

**Goal:** Build a full monitoring stack — metrics, logs, alerts, dashboards.

| Module | Key Concepts |
|---|---|
| Azure Monitor | Metrics, alerts, action groups |
| Log Analytics | Workspace, data sources, retention |
| KQL | Query language for all Azure logs |
| Application Insights | APM, traces, dependency maps |
| Container Insights | AKS pod/node metrics |
| Grafana | Azure Monitor datasource, dashboards |
| Alerts | Static vs dynamic thresholds |

**KQL Quick Reference:**
```kql
-- Pod restarts in last 1 hour
KubePodInventory
| where TimeGenerated > ago(1h)
| where RestartCount > 0
| project Name, Namespace, RestartCount, TimeGenerated

-- Node CPU > 80%
Perf
| where ObjectName == "K8SNode"
| where CounterName == "cpuUsageNanoCores"
| summarize AvgCPU=avg(CounterValue) by Computer, bin(TimeGenerated, 5m)
| where AvgCPU > 80

-- Failed deployments in pipeline
AzureDevOpsAuditEvent
| where OperationName == "Release.DeploymentCompleted"
| where Data.DeploymentStatus == "failed"
| project TimeGenerated, ProjectName, ReleaseName, StageName
```

---

### TRACK 9 — Security

**Goal:** Implement zero-trust security across identity, data, and workloads.

| Module | Key Concepts |
|---|---|
| Entra ID | Users, groups, service principals, managed identity |
| RBAC | Built-in roles, custom roles, scope levels |
| PIM | Just-in-time privileged access |
| Key Vault | Secrets, keys, certificates, access policies |
| Defender for Cloud | Security score, recommendations |
| tfsec | Terraform IaC security scanning |
| Pod Security | Non-root, read-only FS, securityContext |

**RBAC Scope Hierarchy:**
```
Management Group
└── Subscription
    └── Resource Group
        └── Resource
```

**Key Vault + AKS CSI Pattern:**
```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-kv-secrets
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: ""   # empty = system-assigned
    keyvaultName: "my-kv"
    objects: |
      array:
        - |
          objectName: db-password
          objectType: secret
```

---

### TRACK 10 — SRE

**Goal:** Operate production systems with SRE principles — reliability > features.

| Module | Key Concepts |
|---|---|
| SLI | Service Level Indicator (what to measure) |
| SLO | Service Level Objective (target %) |
| SLA | Service Level Agreement (contractual) |
| Error Budget | How much downtime is allowed |
| Incident Management | Severity levels, runbooks, war rooms |
| Post-Mortems | Blameless, 5-whys, action items |
| Chaos Engineering | Fault injection, resilience testing |

**SLI/SLO Example (AKS API):**
```
SLI : % of API requests completing in < 200ms
SLO : 99.9% over 30 days
Error Budget : 0.1% = 43.8 min/month downtime allowed

Alert : page on-call when error budget burn rate > 2x
```

---

## INTERVIEW PREPARATION ENGINE

### Level 1 — Theory

```
Q: What is a Resource Group in Azure?
Q: Difference between NSG and Azure Firewall?
Q: What is a Managed Identity?
Q: How does AKS autoscaling work?
Q: What is the difference between Deployment and StatefulSet?
```

### Level 2 — Scenario Based

```
Q: You need to migrate 200 VMs from AWS to Azure. Walk me through your approach.
Q: A developer cannot push to ACR from the pipeline. How do you troubleshoot?
Q: Terraform apply is failing on AKS module. What do you check first?
Q: Cost alert fired — Azure bill is 40% higher than last month. What happened?
```

### Level 3 — Production Troubleshooting

```
Q: AKS cluster OOMKilled pods every night at 2 AM. Root cause and fix?
Q: Azure Pipeline stage is stuck at approval for 2 hours. What do you check?
Q: Key Vault secret rotation broke the app. How do you recover with zero downtime?
Q: VNET peering is configured but VMs cannot communicate. Debug steps?
```

### Level 4 — Architecture Design Round

```
Q: Design a secure, multi-region AKS platform for a fintech company.
Q: How would you build a zero-downtime blue-green deployment on AKS?
Q: Design a Terraform module structure for a 5-environment enterprise.
Q: Build an observability stack for 200 microservices on AKS.
```

---

## HYDERABAD JOB MARKET ENGINE

**Top Hiring GCCs (Hyderabad 2026):**
```
Microsoft     → Azure Platform, AKS, DevOps
Amazon AWS    → Cloud Infra (still hiring Azure bilingual)
Jio Platforms → Azure DevOps, Terraform, AKS (Vikram's current)
HSBC GCC      → Azure Security, Kubernetes
Deloitte      → Azure DevOps, Terraform, CI/CD
Capgemini     → AKS, Azure Monitor, SRE
Infosys       → Azure Migrate, DevOps pipelines
```

**Top Skills Extracted from JDs (June 2026):**
```
Skill              Frequency   Salary Impact
-------------------------------------------------
AKS                High        +15–20%
Terraform          High        +10–15%
Azure DevOps       High        baseline
Azure Monitor/KQL  Medium      +8%
Key Vault          Medium      +5%
Helm               Medium      +8%
GitOps (ArgoCD)    Growing     +12%
SRE practices      Growing     +15%
```

---

## JD ANALYZER FLOW

```
User uploads JD
      |
      ↓
AI extracts: [AKS, Terraform, Azure DevOps, Docker, Helm, Key Vault]
      |
      ↓
Match vs User Skills: [Azure ✓, Terraform ✓, Docker ✓]
      |
      ↓
Gap Identified: [AKS ✗, Helm ✗, Key Vault ✗]
      |
      ↓
Auto Learning Plan Generated:
  Week 1 → AKS Track (Theory + KodeKloud lab)
  Week 2 → Helm (install, chart, values.yaml)
  Week 3 → Key Vault CSI (AKS integration lab)
  Week 4 → Mock Interview (all 3 gaps)
```

---

## VIKRAM'S PERSONAL 8-WEEK SPRINT PLAN

Based on DevOps Project Readiness Playbook (8 Steps)

```
WEEK 1  → Step 1+2 : Understand Project + Access/Permissions
          Theory   : Azure subscription structure, RBAC, Entra ID
          Hands-On : KodeKloud → RBAC lab, Key Vault access policy

WEEK 2  → Step 3   : Terraform Provisioning Order
          Theory   : Dependency graph, remote state, modules
          Hands-On : Clone RIL_DevOps repo, deploy VNET+AKS via Terraform

WEEK 3  → Step 4   : CI/CD Pipeline
          Theory   : Azure Pipelines YAML, stages, environments, gates
          Hands-On : azure-pipelines.yml → Build → ACR push → AKS deploy

WEEK 4  → Step 5   : Monitoring
          Theory   : Azure Monitor, Log Analytics, KQL queries
          Hands-On : Enable Container Insights, write 5 KQL queries, set alerts

WEEK 5  → Step 6   : Health Status
          Theory   : kubectl daily checks, pod restarts, node pressure
          Hands-On : kubectl commands drill, create runbook doc

WEEK 6  → Step 7   : Security
          Theory   : RBAC scopes, Key Vault CSI, tfsec, pod securityContext
          Hands-On : tfsec scan on Terraform code, fix findings

WEEK 7  → Step 8   : Day-2 Operations
          Theory   : Incident response, cost management, scaling
          Hands-On : Simulate pod crash → alert → runbook → fix

WEEK 8  → Interview Prep
          Level 1  : 20 theory Q&A spoken aloud (English practice)
          Level 2  : 10 scenario Q&A
          Level 3  : 5 production troubleshooting walkthroughs
          Level 4  : 1 full architecture design mock
```

---

## DEVELOPMENT ROADMAP (Platform Build)

### Phase 1 — MVP (2 Weeks)
- Authentication (Entra ID + Google)
- Dashboard with progress tracking
- Roadmap visualization
- Learning modules (Track 1–2)

### Phase 2 — Labs (3 Weeks)
- KodeKloud-style sandbox
- Quiz engine per module
- Progress persistence

### Phase 3 — Interview System (3 Weeks)
- AI Interviewer (Azure OpenAI)
- Resume analyzer
- JD Gap Analyzer

### Phase 4 — Production Learning (4 Weeks) [✅ COMPLETED]
- Architecture diagram visualizer via raw Markdown integration
- Troubleshooting simulator and Full AKS labs natively available
- 60+ curriculum docs injected directly into the application

### Phase 5 — Smart UI & AI Optimization (2 Weeks) [✅ COMPLETED]
- Migrated AI Interviewer to Google Gemini 3.5 Flash Streaming API
- Built custom Next.js Markdown DOM interceptor for styling
- Integrated Universal Global Search (`Ctrl+K`) for docs and labs
- Overhauled navigation and visual polish (Tailwind CSS v4 + shadcn/ui)

### Phase 6 — Market Intelligence & Cloud Sync (Next Steps)
- Hyderabad job scan (LinkedIn, Naukri, Foundit)
- Salary trend graphs and Database progress syncing

---

## TECH STACK

```
Frontend    : Next.js + TypeScript + TailwindCSS + ShadCN UI
Backend     : Node.js + NestJS
Auth        : Microsoft Entra ID + Google OAuth
Database    : PostgreSQL
Cache       : Redis
Search      : Elasticsearch
AI          : Azure OpenAI Service (GPT-4o)
Infra       : AKS + ACR + Key Vault + Azure Monitor
IaC         : Terraform + Bicep
CI/CD       : Azure Pipelines
```

---

## DATABASE SCHEMA (Core Tables)

```sql
-- Users
CREATE TABLE users (
  user_id     UUID PRIMARY KEY,
  name        VARCHAR(100),
  email       VARCHAR(100) UNIQUE,
  experience  INT,           -- years
  current_role VARCHAR(100),
  target_role  VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Courses / Tracks
CREATE TABLE courses (
  course_id   UUID PRIMARY KEY,
  title       VARCHAR(200),
  track       INT,           -- 1–10
  difficulty  VARCHAR(20)    -- beginner/intermediate/advanced
);

-- Topics
CREATE TABLE topics (
  topic_id    UUID PRIMARY KEY,
  course_id   UUID REFERENCES courses(course_id),
  title       VARCHAR(200),
  section     INT            -- 1=theory 2=realworld 3=arch 4=lab 5=troubleshoot 6=interview
);

-- Labs
CREATE TABLE labs (
  lab_id      UUID PRIMARY KEY,
  topic_id    UUID REFERENCES topics(topic_id),
  instructions TEXT,
  sandbox_type VARCHAR(50)   -- cli/terraform/kubectl
);

-- Interview Questions
CREATE TABLE interview_questions (
  q_id        UUID PRIMARY KEY,
  topic_id    UUID REFERENCES topics(topic_id),
  level       INT,           -- 1–4
  question    TEXT,
  answer      TEXT
);

-- Job Descriptions
CREATE TABLE job_descriptions (
  jd_id       UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(user_id),
  raw_text    TEXT,
  skills      JSONB,         -- extracted skills array
  gap_skills  JSONB,         -- missing skills
  created_at  TIMESTAMP DEFAULT NOW()
);

-- User Progress
CREATE TABLE user_progress (
  progress_id UUID PRIMARY KEY,
  user_id     UUID REFERENCES users(user_id),
  topic_id    UUID REFERENCES topics(topic_id),
  status      VARCHAR(20),   -- not_started/in_progress/completed
  score       INT,
  completed_at TIMESTAMP
);
```

---

## AI MENTOR PROMPTS (Reusable Blocks)

```
EXPLAIN MODE:
"Explain [Azure Service] as if I am an AWS engineer with 7 years experience.
 Give me: 1-line definition, AWS equivalent, real Jio/enterprise use case,
 one Terraform snippet, one KQL query if applicable."

QUIZ MODE:
"Generate 5 interview questions about [Topic] at [Level] level.
 Format: Question | Expected Answer | Follow-up probe."

CODE REVIEW MODE:
"Review this Terraform/YAML for: security issues, best practice violations,
 KodeKloud sandbox compatibility. List findings as: CRITICAL / WARNING / INFO."

MOCK INTERVIEW MODE:
"You are a senior Azure DevOps interviewer at a Hyderabad GCC.
 Ask me one question at a time. After my answer, give score 1–10,
 correct what was wrong, then ask the next question."

ARCHITECTURE MODE:
"I need to design [system] on Azure for [company type].
 Constraints: [list]. Generate: architecture diagram in ASCII,
 list of Azure services used, Terraform modules needed,
 security checklist, monitoring strategy."
```

---

## GLOSSARY (LLM CONTEXT)

```
AKS      → Azure Kubernetes Service (managed K8s)
ACR      → Azure Container Registry
VNET     → Virtual Network
NSG      → Network Security Group
UDR      → User Defined Route
PIM      → Privileged Identity Management
CSI      → Container Storage Interface (used for Key Vault secrets)
KQL      → Kusto Query Language (Azure Monitor query language)
VMSS     → Virtual Machine Scale Set
HPA      → Horizontal Pod Autoscaler
GCC      → Global Capability Center (MNC tech hubs in Hyderabad)
SLI/SLO  → Service Level Indicator / Objective
tfsec    → Terraform security static analysis tool
Trivy    → Container image vulnerability scanner
GitOps   → Git as single source of truth for infra + app state
```

---
