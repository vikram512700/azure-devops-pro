# Azure DevOps & AI Learning Platform 🚀

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_in_GitHub_Pages-blue?style=for-the-badge&logo=github)](https://vikram512700.github.io/azure-devops-pro/)

A comprehensive, interactive Learning Platform designed to teach Azure Fundamentals, Enterprise DevOps, Production Architecture, and SRE best practices. Built specifically for engineers looking to master the GCC job market and transition into Senior Cloud/SRE roles.

## 🌟 Key Features
- **60+ Interactive Modules**: A massive curriculum spanning Linux, Git, Docker, Kubernetes, Azure, Terraform, and CI/CD.
- **Unified Curriculum Docs Portal**: A dedicated `docs` space with beautiful icon-driven navigation for discovering all deep-dive notes and best practices.
- **Smart Formatting Engine**: Automated injection of Emerald Definition boxes, Real-Time Scenarios, and Tips across all chapters using a custom Next.js Markdown interceptor.
- **Blazing Fast AI Interviewer**: Chat-based mock interviews using `gemini-3.5-flash` with real-time UI text streaming for instant feedback.
- **JD Analyzer**: Paste Job Descriptions to map your skills against real-world roles using AI.
- **Dynamic Quiz Engine**: Test your knowledge on every module with AI-generated multiple-choice quizzes and earn XP.
- **Universal Global Search**: Instantly find interactive labs and Markdown docs using the `Ctrl+K` command palette.

## 🏗️ Architecture Stack
The platform currently operates as a highly responsive, client-heavy architecture built for speed and seamless UX:
- **Frontend Framework**: Next.js 16 (App Router) with Turbopack and TypeScript.
- **Docs Engine**: React Markdown with `@tailwindcss/typography` and dynamic DOM interception.
- **Styling**: TailwindCSS v4 & `shadcn/ui` (Radix UI primitives).
- **State Management**: React Hooks & Local Storage for offline-first XP and module tracking.
- **AI Integration**: Google Gemini API streaming (executed directly from the client via user-provided API key).

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Start
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the Application at **[http://localhost:3000](http://localhost:3000)**.

## 📚 Environment Configuration (AI Features)
The platform uses the **Google Gemini API** for the AI Interviewer and JD Analyzer features.
Instead of setting up complex `.env` files, you can securely input your `GEMINI_API_KEY` directly within the **Dashboard -> Settings** panel of the running web application. The key is stored securely in your browser's local storage.

## 🤝 Project Roadmap
- Phase 1: Core MVP & UI Scaffold (✅ Completed)
- Phase 2: Quiz Engine & Interactive Labs (✅ Completed)
- Phase 3: AI Interviewer & JD Analyzer Integrations (✅ Completed)
- Phase 4: Full 60+ Module Curriculum Expansion (✅ Completed)
- Phase 5: Smart Markdown Engine & Global Search Integration (✅ Completed)
- Phase 6: Cloud Database Migration & Progress Synchronization (🚀 Next Steps)
