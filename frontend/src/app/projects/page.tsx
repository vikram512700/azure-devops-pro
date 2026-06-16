"use client";

import { useState } from "react";
import Link from "next/link";
import { projectsData, ProjectDifficulty, ProjectCategory } from "@/data/projects";
import { BookOpen, Star, Clock, Briefcase, CheckCircle2 } from "lucide-react";
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
  const { isProjectCompleted } = useProgress();

  const projectsList = Object.values(projectsData);
  
  const filteredProjects = projectsList.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesDifficulty = activeDifficulty === "All" || p.difficulty === activeDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Capstone Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Apply your knowledge by building 20 production-grade architecture challenges. Prove your skills, earn XP, and add real-world scenarios to your resume.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge 
            variant={activeDifficulty === "All" ? "default" : "outline"}
            className="cursor-pointer hover:bg-blue-600"
            onClick={() => setActiveDifficulty("All")}
          >
            All Difficulties
          </Badge>
          {DIFFICULTIES.map(diff => (
            <Badge 
              key={diff}
              variant={activeDifficulty === diff ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-600"
              onClick={() => setActiveDifficulty(diff)}
            >
              {diff}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Badge 
            variant={activeCategory === "All" ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => setActiveCategory("All")}
          >
            All Categories
          </Badge>
          {CATEGORIES.map(cat => (
            <Badge 
              key={cat}
              variant={activeCategory === cat ? "secondary" : "outline"}
              className="cursor-pointer hover:bg-gray-700"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => {
          const isDone = isProjectCompleted(project.id);
          
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
              style={{ animationDelay: `${idx * 100}ms` }}
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
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${difficultyColor} mb-3`}>
                  {project.difficulty}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm font-semibold text-blue-400 mb-2">{project.subtitle}</p>
                {project.overview && (
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {project.overview}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {project.estimatedHours}h</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {project.category}</span>
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
                {isDone ? "Review Project" : "Start Project"}
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
