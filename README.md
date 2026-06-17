<div align="center">
  
# 🚀 Azure DevOps Roadmap Pro
**A Full-Stack SaaS Learning Platform & AI Mentor Engine**

![Azure DevOps Platform Banner](./assets/banner.png)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_in_GitHub_Pages-blue?style=for-the-badge&logo=github)](https://vikram512700.github.io/azure-devops-pro/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Terraform](https://img.shields.io/badge/Terraform-1.x-7B42BC?style=for-the-badge&logo=terraform)](https://terraform.io)
[![Azure](https://img.shields.io/badge/Azure-Cloud-0089D6?style=for-the-badge&logo=microsoft-azure)](https://azure.microsoft.com/)

*Built for Senior Azure DevOps & Platform Engineers targeting Hyderabad GCCs.*

</div>

---

## 📖 What is this?

This is **not** just a collection of notes. It is a **portfolio-grade DevOps academy** shaped around daily operations in enterprise platform teams. Every chapter, lab, and AI feature is designed to answer one practical question:

> *"Can you explain it, build it, troubleshoot it, and defend it in an interview?"*

**Unique Angle:** Hyderabad job market intelligence + JD analyzer + LangGraph AI mentor.

---

## 🗺️ The Learning Roadmap (What's Inside)

```mermaid
graph TD
    subgraph "Phase 1: The Foundations"
        L[1. Linux Admin] --> P[2. Scripting Python/Bash]
        P --> G[3. Git & GitHub]
    end
    subgraph "Phase 2: Containers & Cloud"
        G --> D[4. Docker]
        D --> K[5. Kubernetes AKS]
        K --> A[6. Azure Core Services]
    end
    subgraph "Phase 3: Infrastructure as Code"
        A --> T[7. Terraform]
        T --> An[8. Ansible]
    end
    subgraph "Phase 4: Automation & SRE"
        An --> C[9. Azure DevOps CI/CD]
        C --> M[10. Monitoring & Grafana]
        M --> S[11. DevSecOps]
    end
    subgraph "Phase 5: The Master Level"
        S --> Cap[12. Capstone Projects]
        Cap --> AI[13. AI & ML for DevOps]
    end

    style L fill:#10b981,stroke:#047857,color:#fff,stroke-width:2px
    style P fill:#f59e0b,stroke:#b45309,color:#fff,stroke-width:2px
    style G fill:#f97316,stroke:#c2410c,color:#fff,stroke-width:2px
    style D fill:#3b82f6,stroke:#1d4ed8,color:#fff,stroke-width:2px
    style K fill:#3b82f6,stroke:#1d4ed8,color:#fff,stroke-width:2px
    style A fill:#0ea5e9,stroke:#0369a1,color:#fff,stroke-width:2px
    style T fill:#6366f1,stroke:#4338ca,color:#fff,stroke-width:2px
    style An fill:#ef4444,stroke:#b91c1c,color:#fff,stroke-width:2px
    style C fill:#8b5cf6,stroke:#6d28d9,color:#fff,stroke-width:2px
    style M fill:#06b6d4,stroke:#0e7490,color:#fff,stroke-width:2px
    style S fill:#10b981,stroke:#047857,color:#fff,stroke-width:2px
    style Cap fill:#f59e0b,stroke:#b45309,color:#fff,stroke-width:2px
    style AI fill:#ec4899,stroke:#be185d,color:#fff,stroke-width:2px
```

### 📚 Curriculum Structure
Every learning module follows a strict, interview-ready format:
1. **Theory** (Plain English, AWS equivalency first)
2. **Real World Example** (Enterprise/Jio/O2C context)
3. **Production Architecture** (Hub-Spoke, Private Endpoints)
4. **Hands-On Lab** (KodeKloud-compatible commands)
5. **Troubleshooting** (Real error scenarios and fixes)
6. **Interview Questions** (Basic, Intermediate, Advanced)

---

## ✨ Core Features & AI Agents

- **🧠 AI Mentor Engine (LangGraph)**: Explains concepts, generates dynamic KodeKloud labs, and conducts 4-level mock interviews (Theory → Scenario → Production → Architecture).
- **🎯 JD Skill Gap Analyzer**: Paste any Job Description and get a match score, missing skills breakdown, and a targeted weekly learning plan.
- **🕷️ Market Crawlers**: Automated GitHub Actions to scrape LinkedIn, Naukri, and Indeed India to analyze Hyderabad hiring trends.
- **🏗️ Enterprise Infrastructure**: Fully built with Terraform, AKS, ACR, Key Vault, PostgreSQL Flexible, and Redis.

---

## 🛠️ Monorepo Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| **Frontend** | Next.js 14 App Router | SSR for SEO, extremely fast TTFB |
| **UI** | TailwindCSS + ShadCN | Rapid, accessible, highly premium components |
| **Backend** | NestJS (Node.js) | Modular, TypeScript-native, enterprise-grade |
| **Primary DB** | PostgreSQL | Relational storage for users, courses, and progress |
| **Cache** | Azure Cache for Redis | Session handling and rate limiting |
| **AI** | Gemini API / Azure OpenAI | JD Analyzer, interview engine, lab generator |
| **Infra** | Terraform + AKS + ACR | Portfolio proof of advanced DevOps skills |
| **CI/CD** | Azure Pipelines | 4-stage pipeline: Build → Test → Staging → Prod |

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- Docker (for full stack)
- Gemini API Key (for AI features)

### Running the App
1. Clone the repo and navigate to the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.
3. To enable AI Features: Go to **Dashboard -> Settings** inside the app and paste your Gemini API Key. (It is stored securely in your local browser storage).

---

## 🤝 Contribution & Usage
- **Docs Tone**: Every chapter reads like a senior engineer explaining how a real system was built. We prioritize "what happened in production" over abstract textbook wording.
- **Secrets**: Never commit secrets. Always use the `.env.local` templates.

> *"Move from 'I know the tool' to 'I can ship the solution.'"*
