# Azure DevOps & AI Learning Platform 🚀

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_in_GitHub_Pages-blue?style=for-the-badge&logo=github)](https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/)

A comprehensive, interactive Learning Platform designed to teach Azure Fundamentals, Enterprise DevOps, Production Architecture, and SRE best practices. Built specifically for engineers looking to master the GCC job market and transition into Senior Cloud/SRE roles.

## 🌟 Key Features
- **60+ Interactive Modules**: A massive curriculum spanning Linux, Git, Docker, Kubernetes, Azure, Terraform, and CI/CD.
- **Smart Docs Portal**: Raw markdown notes dynamically rendered into a gorgeous "Study Book" UI.
- **Intelligent Callouts**: Automated injection of Emerald Definition boxes, Real-Time Scenarios, and Tips across all chapters using our custom Markdown Engine.
- **Blazing Fast AI Interviewer**: Chat-based mock interviews using `gemini-3.5-flash` with real-time UI text streaming for instant feedback.
- **JD Analyzer**: Paste Job Descriptions to map your skills against real-world roles using AI.
- **Dynamic Quiz Engine**: Test your knowledge on every module with AI-generated multiple-choice quizzes and earn XP.
- **Global Search**: Instantly find modules using the `Ctrl+K` command palette.

## 🏗️ Architecture Stack
The platform currently operates as a highly responsive, client-heavy architecture built for speed and seamless UX:
- **Frontend Framework**: Next.js 14/16 (App Router) with TypeScript.
- **Docs Engine**: React Markdown with dynamic HTML/DOM interception for custom components.
- **Styling**: TailwindCSS & `shadcn/ui` (Radix UI primitives).
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
- Phase 4: Full 30-Module Curriculum Expansion & UX Overhaul (✅ Completed)
- Phase 5: Progress Export/Import & Backend Database Migration (⏳ In Progress)
