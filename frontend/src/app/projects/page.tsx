"use client";

import { useState } from "react";
import Link from "next/link";
import { projectsData, ProjectDifficulty, ProjectCategory } from "@/data/projects";
import { BookOpen, Star, Clock, Briefcase, CheckCircle2, Trophy, Zap, Layers3, Target, ListChecks, ShieldCheck, ArrowRight, Package, BadgeCheck, MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/hooks/useProgress";

const CATEGORIES: ProjectCategory[] = [
  "Azure Fundamentals", "DevOps", "AKS", "Terraform", "GitHub Actions", "Monitoring", "Security"
];

const DIFFICULTIES: ProjectDifficulty[] = [
  "Beginner", "Intermediate", "Advanced", "Production"
];

export default function ProjectsHub() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");
  const [activeDifficulty, setActiveDifficulty] = useState<ProjectDifficulty | "All">("All");
  const [showPortfolioOnly, setShowPortfolioOnly] = useState(false);
  const { isProjectCompleted, progress } = useProgress();

  const projectsList = Object.values(projectsData);
  const totalCount = projectsList.length;
  const completedCount = projectsList.filter(p => isProjectCompleted(p.id)).length;
  const portfolioCount = projectsList.filter(p => p.isFeatured).length;

  const filteredProjects = projectsList.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesDifficulty = activeDifficulty === "All" || p.difficulty === activeDifficulty;
    const matchesPortfolio = !showPortfolioOnly || p.isFeatured;
    return matchesCategory && matchesDifficulty && matchesPortfolio;
  });

  const handleDifficultyFilter = (diff: ProjectDifficulty | "All") => {
    setActiveDifficulty(diff);
    setShowPortfolioOnly(false);
  };

  const handleCategoryFilter = (cat: ProjectCategory | "All") => {
    setActiveCategory(cat);
    setShowPortfolioOnly(false);
  };

  const handlePortfolioFilter = () => {
    setShowPortfolioOnly(true);
    setActiveCategory("All");
    setActiveDifficulty("All");
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Capstone Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Apply your knowledge by building 20 production-grade architecture challenges. Prove your skills, earn XP, and add real-world scenarios to your resume.
        </p>
      </div>

      {/* Progress Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalCount}</p>
            <p className="text-xs text-gray-500">Total Projects</p>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{completedCount}<span className="text-sm text-gray-500 font-normal">/{totalCount}</span></p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{progress.projectXp.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Project XP</p>
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{portfolioCount}</p>
            <p className="text-xs text-gray-500">Portfolio Projects</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col space-y-3 mb-8">
        {/* Portfolio quick filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={handlePortfolioFilter}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              showPortfolioOnly
                ? "bg-gradient-to-r from-amber-500 to-orange-400 text-black border-transparent"
                : "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            }`}
          >
            <Star className={`w-3 h-3 ${showPortfolioOnly ? "fill-black" : ""}`} />
            Portfolio Projects
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge
            variant={activeDifficulty === "All" && !showPortfolioOnly ? "default" : "outline"}
            className="cursor-pointer hover:bg-blue-600"
            onClick={() => handleDifficultyFilter("All")}
          >
            All Difficulties
          </Badge>
          {DIFFICULTIES.map(diff => (
            <Badge
              key={diff}
              variant={activeDifficulty === diff && !showPortfolioOnly ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-600"
              onClick={() => handleDifficultyFilter(diff)}
            >
              {diff}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Badge
            variant={activeCategory === "All" && !showPortfolioOnly ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleCategoryFilter("All")}
          >
            All Categories
          </Badge>
          {CATEGORIES.map(cat => (
            <Badge
              key={cat}
              variant={activeCategory === cat && !showPortfolioOnly ? "secondary" : "outline"}
              className="cursor-pointer hover:bg-gray-700"
              onClick={() => handleCategoryFilter(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-500 mb-6 text-center">
        Showing <span className="text-white font-semibold">{filteredProjects.length}</span> of {totalCount} projects
        {showPortfolioOnly && " · Portfolio only"}
        {activeDifficulty !== "All" && ` · ${activeDifficulty}`}
        {activeCategory !== "All" && ` · ${activeCategory}`}
      </p>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => {
          const isDone = isProjectCompleted(project.id);
          const deliverableCount = project.deliverables.length;
          const stepCount = project.steps.length;
          const keywordCount = project.jdKeywords.length;
          const architectureCount = project.architecture.nodes.length;
          const finishLine = project.deliverables[0] ?? "Portfolio-ready outcome";
          const deploySignal = project.steps.slice(0, 2).map(step => step.title).join(" + ");
          const validationSignal = project.steps[project.steps.length - 1]?.validationCmd ?? project.troubleshooting?.[0]?.issue ?? "Execution validation";
          const interviewSignal = project.interviewQuestions[0]?.q ?? "Explain the architecture and tradeoffs";
          const productionImpact = project.productionImpact ?? project.businessContext ?? "This project proves you can build, validate, and explain production-grade work.";

          let difficultyColor = "text-green-400 border-green-400/20 bg-green-400/10";
          if (project.difficulty === "Intermediate") difficultyColor = "text-yellow-400 border-yellow-400/20 bg-yellow-400/10";
          if (project.difficulty === "Advanced") difficultyColor = "text-orange-400 border-orange-400/20 bg-orange-400/10";
          if (project.difficulty === "Production") difficultyColor = "text-red-400 border-red-400/20 bg-red-400/10";

          return (
            <div
              key={project.id}
              className={`relative group rounded-xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isDone ? "bg-emerald-950/20 border-emerald-500/30" : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]"
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {project.isFeatured && (
                <div className="absolute -top-3 -right-3">
                  <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <Star className="w-3 h-3 fill-black" />
                    PORTFOLIO
                  </span>
                </div>
              )}

              {isDone && (
                <div className="absolute top-4 right-4 text-emerald-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}

              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${difficultyColor}`}>
                    {project.difficulty}
                  </span>
                  <span className="text-xs text-gray-600 font-mono">{project.id.toUpperCase()}</span>
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Star className="w-3 h-3 fill-amber-400" />
                      PORTFOLIO
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm font-semibold text-blue-400 mb-2">{project.subtitle}</p>
                {project.overview && (
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {project.overview}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-500" /> {project.estimatedHours}h</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-gray-500" /> {project.category}</span>
                  <span className="flex items-center gap-1.5"><Layers3 className="w-4 h-4 text-gray-500" /> {stepCount} steps</span>
                  <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-gray-500" /> {deliverableCount} deliverables</span>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Finish Line
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed line-clamp-2">
                    Ship a {finishLine.toLowerCase()} and validate it with the execution steps and architecture notes.
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">
                    <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
                    Why it matters in production
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed line-clamp-3">
                    {productionImpact}
                  </p>
                </div>

                <div className="grid gap-2">
                  <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-400" />
                      What you will deploy
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed line-clamp-2">
                      {deploySignal}. Build the working system, not just the diagram.
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                      What you will validate
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed line-clamp-2">
                      {validationSignal}.
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">
                      <MessageSquareText className="w-3.5 h-3.5 text-amber-400" />
                      Interview signal
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed line-clamp-2">
                      Be ready to answer: {interviewSignal}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ListChecks className="w-3.5 h-3.5 text-blue-400" />
                  <span>{keywordCount} job keywords · {architectureCount} architecture components</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-xs bg-white/5 px-2 py-1 rounded-md text-gray-300">
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 3 && (
                    <span className="text-xs bg-white/5 px-2 py-1 rounded-md text-gray-500">
                      +{project.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/projects/${project.id}`}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isDone
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {isDone ? "Review Project" : "Open Full Build"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-24 text-gray-500">
          No projects found matching these filters.
        </div>
      )}
    </main>
  );
}
