# Azure DevOps Roadmap Pro — Implementation Plan

**Owner:** Vikram | Jio Platforms, Hyderabad
**Total Duration:** 16 weeks
**Goal:** Production-ready SaaS on AKS proving full Azure DevOps skillset for GCC hiring

---

## Phase 1 — MVP Core (Weeks 1–2)

### Deliverables
- [ ] Monorepo scaffolded (Next.js + NestJS + Terraform)
- [ ] Microsoft Entra ID auth working (login/logout/session)
- [ ] PostgreSQL schema v1 migrated
- [ ] Dashboard UI: track list, progress rings, user profile
- [ ] Roadmap page: 10 tracks with 6-section module structure
- [ ] 3 sample modules fully authored: AKS, Terraform, Azure Networking
- [ ] Docker Compose local dev environment
- [ ] CI pipeline: lint + test + build (no deploy yet)

### Key Files to Create
```
frontend/src/app/layout.tsx
frontend/src/app/dashboard/page.tsx
frontend/src/app/roadmap/page.tsx
frontend/src/app/module/[id]/page.tsx
backend/src/modules/auth/auth.module.ts
backend/src/modules/users/users.module.ts
backend/src/modules/courses/courses.module.ts
backend/src/database/migrations/001_initial_schema.sql
docker-compose.yml
```

### Done When
- User can log in with Microsoft account
- User can see roadmap with 3 modules
- All 6 sections render per module
- Progress is saved per user

---

## Phase 2 — Labs & Quiz Engine (Weeks 3–5)

### Deliverables
- [ ] Quiz engine: MCQ + scenario questions, adaptive difficulty
- [ ] Progress tracking per module per user
- [ ] Lab generator: produces KodeKloud-compatible bash scripts
- [ ] Sandbox instructions panel (inline terminal steps)
- [ ] XP / streak system (gamification)
- [ ] 10 full modules authored (1 per track)
- [ ] Redis caching for module content + user sessions

### Key Files to Create
```
backend/src/modules/quiz/quiz.module.ts
backend/src/modules/labs/labs.module.ts
backend/src/modules/progress/progress.module.ts
frontend/src/components/QuizEngine/index.tsx
frontend/src/components/LabPanel/index.tsx
frontend/src/components/ProgressRing/index.tsx
```

### Done When
- User completes a quiz and gets score
- Lab instructions generate from module content
- XP updates in real time

---

## Phase 3 — Interview Engine & JD Analyzer (Weeks 6–8)

### Deliverables
- [ ] AI interviewer: 4 levels, WebSocket streaming responses
- [ ] JD analyzer: upload PDF/paste text → gap analysis → learning plan
- [ ] Resume skill extractor (PDF upload → Azure OpenAI)
- [ ] Mock interview session recorder (text transcript saved)
- [ ] Interview Q bank: 60 questions per module (20+20+20)
- [ ] Spoken English practice mode (text → speak prompts for Vikram)

### Key Files to Create
```
ai-mentor/agents/interview_agent.py
ai-mentor/agents/jd_analyzer_agent.py
ai-mentor/prompts/interview_system_prompt.txt
ai-mentor/prompts/jd_analyzer_system_prompt.txt
backend/src/modules/interview/interview.module.ts
backend/src/modules/jd-analyzer/jd-analyzer.module.ts
frontend/src/app/interview/page.tsx
frontend/src/app/jd-analyzer/page.tsx
```

### Done When
- User uploads JD and gets skill gap + 5-week learning plan
- User completes Level 3 mock interview and gets feedback

---

## Phase 4 — Production Architecture Learning (Weeks 9–12)

### Deliverables
- [ ] Architecture visualizer: interactive Azure diagrams per topic
- [ ] Troubleshooting simulator: inject fault → user diagnoses → scored
- [ ] Full AKS module: 6 sections, ACR + Key Vault CSI pattern
- [ ] O2C (Oil-to-Chemical) reference architecture module
- [ ] All 10 tracks: minimum 3 modules each (30 total)
- [ ] Platform deployed to AKS (dogfooding complete)

### Key Files to Create
```
frontend/src/components/ArchitectureDiagram/index.tsx
frontend/src/components/TroubleshootingSimulator/index.tsx
docs/architecture/O2C_REFERENCE_ARCH.md
infra/terraform/main.tf (complete)
infra/k8s/ (all manifests)
infra/pipelines/azure-pipelines.yml (4-stage)
```

### Done When
- Platform itself is running on AKS in Azure
- Troubleshooting simulator has 10 scenarios
- O2C architecture module is fully authored

---

## Phase 5 — Hyderabad Market Intelligence (Weeks 13–16)

### Deliverables
- [ ] JD crawler: LinkedIn + Naukri + Foundit + Indeed India (daily cron)
- [ ] Skill frequency dashboard: top 20 skills in Hyderabad Azure JDs
- [ ] Salary trend charts: experience band × skill stack
- [ ] GCC company tracker: EY, Deloitte, TCS, HCL, Capgemini, Infosys, KPMG
- [ ] Weekly AI DevOps trends digest (GitHub Actions → Azure OpenAI → email)
- [ ] Skill gap report: user skills vs market demand (weekly auto-email)

### Key Files to Create
```
crawlers/linkedin/crawler.ts
crawlers/naukri/crawler.ts
crawlers/foundit/crawler.ts
crawlers/shared/skill-extractor.ts
crawlers/shared/job-normalizer.ts
.github/workflows/daily-crawl.yml
backend/src/modules/market-intel/market-intel.module.ts
frontend/src/app/market/page.tsx
```

### Done When
- Daily cron runs and populates job_listings table
- Market dashboard shows live Hyderabad JD data
- User receives weekly skill gap email

---

## Database Schema v1

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  entra_id VARCHAR(255),
  experience_years INT,
  current_role VARCHAR(255),
  target_role VARCHAR(255),
  location VARCHAR(255) DEFAULT 'Hyderabad',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks (10 tracks)
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INT UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50) -- beginner | intermediate | advanced
);

-- Modules (30+ modules, 3+ per track)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES tracks(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  theory JSONB,
  real_world JSONB,
  production_arch JSONB,
  hands_on_lab JSONB,
  troubleshooting JSONB,
  interview_questions JSONB,
  order_index INT,
  difficulty VARCHAR(50)
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  module_id UUID REFERENCES modules(id),
  section_completed JSONB DEFAULT '[]',
  quiz_score INT,
  lab_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  xp_earned INT DEFAULT 0,
  UNIQUE(user_id, module_id)
);

-- Job Listings (crawled daily)
CREATE TABLE job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL, -- linkedin | naukri | foundit | indeed
  title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  experience_min INT,
  experience_max INT,
  salary_min BIGINT,
  salary_max BIGINT,
  skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  raw_description TEXT,
  url VARCHAR(1024),
  posted_at DATE,
  crawled_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Sessions
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  module_id UUID REFERENCES modules(id),
  level INT CHECK (level BETWEEN 1 AND 4),
  transcript JSONB DEFAULT '[]',
  score INT,
  feedback TEXT,
  completed_at TIMESTAMPTZ
);

-- JD Analysis
CREATE TABLE jd_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  raw_jd TEXT,
  extracted_skills JSONB DEFAULT '[]',
  user_skills JSONB DEFAULT '[]',
  gap_skills JSONB DEFAULT '[]',
  match_score INT,
  learning_plan JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Vikram's Personal Skill Baseline (used to seed JD analyzer)

```json
{
  "strong": ["AWS EC2", "VPC", "IAM", "S3", "RDS", "CloudWatch",
             "Azure VMs", "VMSS", "Azure CLI", "Terraform", "Bicep",
             "Docker", "ACR", "Azure Pipelines", "Key Vault", "RBAC",
             "Git", "Azure DevOps"],
  "building": ["AKS", "Helm", "KQL", "Azure Monitor", "Grafana",
                "GitOps", "Selenium Java"],
  "gap": ["ArgoCD", "SRE/SLO design", "Chaos Engineering",
           "PIM", "Azure AI/OpenAI", "LangGraph", "MLOps"]
}
```

---

## Risk Register

| Risk | Mitigation |
|---|---|
| LinkedIn blocks crawler | Playwright with delays + rotating user agents; fall back to Naukri |
| Azure OpenAI quota limits | Cache responses in Redis; use GPT-3.5 for non-critical paths |
| KodeKloud session expires mid-lab | All labs designed for <2h; bookmark state in README |
| Scope creep | Phase gates: nothing in Phase 2 until Phase 1 "Done When" criteria met |
| Entra ID MSAL config | Use MSAL.js v3 browser library; test with personal Microsoft account first |
