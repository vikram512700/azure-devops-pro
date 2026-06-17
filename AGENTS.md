# Azure DevOps Roadmap Pro — AGENTS.md

## Project Owner
Vikram | Deputy Manager – Cloud Engineer | Jio Platforms, Hyderabad
Target: Senior Azure DevOps / Platform Engineer roles at Hyderabad GCCs

## What This Project Is
A full-stack SaaS learning platform that teaches end-to-end Azure DevOps —
Fundamentals → AKS → Terraform → CI/CD → SRE → AI Integration.
Unique angle: Hyderabad job market intelligence + JD analyzer + AI mentor.

---

## Monorepo Structure

```
azure-devops-roadmap-pro/
├── frontend/          # Next.js 14 + TypeScript + TailwindCSS + ShadCN
├── backend/           # NestJS + PostgreSQL + Redis
├── infra/
│   ├── terraform/     # AKS + ACR + Key Vault + PostgreSQL Flexible + Redis
│   ├── k8s/           # Kubernetes manifests
│   └── pipelines/     # Azure Pipelines YAML
├── crawlers/          # JD crawlers: LinkedIn, Naukri, Foundit, Indeed India
├── ai-mentor/         # LangGraph agents: explain, quiz, mock interview, JD analyzer
└── docs/              # Implementation plan, architecture, ADRs
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 App Router | SSR for SEO, fast TTFB |
| UI | TailwindCSS + ShadCN | Rapid, accessible components |
| Backend | NestJS (Node.js) | Modular, TypeScript-native, enterprise-grade |
| Auth | Microsoft Entra ID (MSAL) + Google OAuth | Target users have Microsoft accounts |
| Primary DB | PostgreSQL (Azure Database for PostgreSQL Flexible) | Relational: users, courses, progress, subscriptions |
| Cache | Azure Cache for Redis | Session, rate limiting, job scan results |
| Search | Azure AI Search (replaces Elasticsearch) | Native Azure, managed |
| AI | Azure OpenAI (GPT-4o) + LangGraph | AI mentor, JD analyzer, interview engine |
| Infra | Terraform + AKS + ACR + Key Vault | Portfolio proof of DevOps skills |
| CI/CD | Azure Pipelines | 4-stage: build → test → staging → prod (manual gate) |
| Monitoring | Azure Monitor + KQL + Grafana + App Insights | Full observability |

---

## KodeKloud Sandbox Constraints (for personal dev/testing)
- Allowed regions: westus, eastus, centralus, southcentralus
- No new resource group creation (use existing)
- AKS: max 1 node pool, 2× Standard_D2s_v3, Basic/Standard SKUs only
- No subscription-level RBAC assignments
- Use `skip_provider_registration = true` in azurerm provider

---

## Key Commands

### Local Development
```bash
# Start everything
docker compose up -d

# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run start:dev

# Run crawlers manually
cd crawlers && npm run crawl:all

# Run AI mentor tests
cd ai-mentor && python -m pytest tests/
```

### Terraform (KodeKloud sandbox)
```bash
cd infra/terraform
terraform init
terraform plan -var-file="environments/dev.tfvars"
terraform apply -var-file="environments/dev.tfvars" -auto-approve
```

### Azure Pipelines
Trigger: push to `main` → build → test → staging → manual approval → prod

---

## Module Content Rules (Vikram's format)
Every learning module MUST have exactly 6 sections:
1. Theory (plain English, AWS analogy first)
2. Real World Example (Reliance/Jio/O2C context where possible)
3. Production Architecture (Hub-Spoke, Private Endpoints, etc.)
4. Hands-On Lab (KodeKloud-compatible commands, bracketed placeholders)
5. Troubleshooting (3-5 real error scenarios with kubectl/az CLI fixes)
6. Interview Questions (20 basic + 20 intermediate + 20 advanced)

---

## Crawler Strategy
- LinkedIn: Playwright headless (rate-limited, 50 jobs/day)
- Naukri: Official API where available, else cheerio HTML scrape
- Foundit / Indeed India: cheerio + rotating proxies
- GitHub Actions cron: runs at 06:00 IST daily
- Output: stored in PostgreSQL `job_listings` table + Redis cache (TTL 24h)
- Skill extraction: Azure OpenAI GPT-4o with structured output JSON schema

---

## AI Mentor Agents (LangGraph)
1. `explain_agent` — concept explanation with AWS→Azure analogy
2. `quiz_agent` — adaptive MCQ + scenario questions
3. `jd_analyzer_agent` — gap analysis from uploaded JD PDF
4. `interview_agent` — 4-level mock interview (theory → scenario → production → arch)
5. `lab_generator_agent` — generates KodeKloud-compatible hands-on labs
6. `trends_agent` — weekly AI DevOps trends digest from GitHub, Azure blog, CNCF

---

## AI DevOps Trends to Learn (2025-2026)
See: docs/AI_DEVOPS_TRENDS_2026.md

---

## Environment Variables (never commit secrets)
Use Azure Key Vault CSI driver in AKS.
Local dev: `.env.local` (gitignored).
See: docs/ENV_TEMPLATE.md

---

## Coding Standards
- TypeScript strict mode everywhere
- ESLint + Prettier pre-commit hooks
- All Terraform: tfsec scan in pipeline
- All Docker images: Trivy scan before push to ACR
- No hardcoded secrets — Key Vault or env vars only
- Branch strategy: `main` (prod) / `develop` (staging) / `feature/*`

---

## Vikram's Reminder
- caveman format for all CLI blocks (no prose padding)
- bracketed placeholders for all variable values: [RESOURCE_GROUP], [AKS_CLUSTER]
- AWS→Azure equivalency in every new concept
- Module labs must work inside KodeKloud 3-hour session window
