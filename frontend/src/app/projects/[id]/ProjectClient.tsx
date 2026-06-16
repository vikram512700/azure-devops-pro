"use client";

import { useState } from "react";
import { Project } from "@/data/projects";
import { useProgress } from "@/hooks/useProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, CheckCircle2, Circle, Clock, Briefcase, ChevronRight, 
  Terminal, Server, Network, Shield, Copy, Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectClient({ project }: { project: Project }) {
  const router = useRouter();
  const { isProjectCompleted, markProjectCompleted } = useProgress();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const isDone = isProjectCompleted(project.id);

  const handleMarkComplete = () => {
    // XP Calculation
    let xp = 150;
    if (project.difficulty === "Intermediate") xp = 300;
    if (project.difficulty === "Advanced") xp = 500;
    if (project.difficulty === "Production") xp = 750;
    
    markProjectCompleted(project.id, xp);
  };

  const copyToClipboard = (text: string, stepId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.push('/projects')}
          className="flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge variant="outline" className={
                project.difficulty === "Beginner" ? "text-green-400 border-green-400/20 bg-green-400/10" :
                project.difficulty === "Intermediate" ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" :
                project.difficulty === "Advanced" ? "text-orange-400 border-orange-400/20 bg-orange-400/10" :
                "text-red-400 border-red-400/20 bg-red-400/10"
              }>
                {project.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">{project.category}</Badge>
              {isDone && <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle2 className="w-3 h-3 mr-1"/> Completed</Badge>}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {project.title}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              {project.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px] bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Est. Time: {project.estimatedHours}h</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Job Keywords: {project.jdKeywords.length}</span>
            </div>
            {!isDone ? (
              <Button onClick={handleMarkComplete} className="w-full mt-2 bg-blue-600 hover:bg-blue-500">
                Mark Complete
              </Button>
            ) : (
              <div className="mt-2 text-center text-sm font-semibold text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 py-2 rounded-md">
                Project Mastered
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b border-white/10 rounded-none bg-transparent p-0 mb-8 h-auto flex-wrap">
          <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Overview</TabsTrigger>
          <TabsTrigger value="architecture" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Architecture</TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Business & Cost</TabsTrigger>
          <TabsTrigger value="steps" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Execution</TabsTrigger>
          <TabsTrigger value="day2" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Production Runbook</TabsTrigger>
          <TabsTrigger value="interview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Interview Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          {project.overview && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Project Overview</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {project.overview}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Skills Gained</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map(skill => (
                    <span key={skill} className="bg-white/5 border border-white/10 text-gray-200 px-3 py-1.5 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4">Deliverables</h3>
                <ul className="space-y-3">
                  {project.deliverables.map((del, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      {del}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Target Job Keywords</h3>
                <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-5">
                  <p className="text-sm text-blue-200/70 mb-4">
                    Completing this project provides concrete evidence for these resume keywords commonly found in GCC JDs:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.jdKeywords.map(kw => (
                      <Badge key={kw} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {project.linkedModuleIds && project.linkedModuleIds.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Prerequisite Modules</h3>
                  <div className="flex flex-col gap-2">
                    {project.linkedModuleIds.map(id => (
                      <Link key={id} href={`/module/${id}`} className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-lg transition-colors">
                        <span className="text-gray-300">Interactive Lab {id}</span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Architecture Design</h3>
            <p className="text-gray-400 mb-8 max-w-3xl leading-relaxed">
              {project.architecture.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Flow Sequence</h4>
                <div className="space-y-3">
                  {project.architecture.connections.map((conn, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300 font-mono text-sm bg-black/40 p-3 rounded-lg border border-white/5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs shrink-0">{i+1}</span>
                      {conn}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Components Used</h4>
                <div className="flex flex-wrap gap-3">
                  {project.architecture.nodes.map((node, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-200">
                      <Server className="w-4 h-4 text-emerald-400" />
                      {node}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="business" className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
          {project.businessContext ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Business Context</h3>
              <p className="text-gray-300 leading-relaxed max-w-3xl border-l-4 border-blue-500 pl-4 py-1 bg-white/5 rounded-r-lg">
                {project.businessContext}
              </p>
            </div>
          ) : (
            <div className="text-gray-500 italic p-4">Business context currently unavailable for this legacy project.</div>
          )}

          {project.costAnalysis && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Cost Analysis</h3>
              <p className="text-gray-300 leading-relaxed bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-sm">
                {project.costAnalysis}
              </p>
            </div>
          )}
        </TabsContent>


        <TabsContent value="steps" className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
          {project.steps.map((step, index) => (
            <div key={step.id} className="bg-[#0f111a] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative group">
              
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-emerald-500"></div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-bold shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                </div>
                
                <p className="text-gray-400 ml-11 mb-6">
                  {step.description}
                </p>

                <div className="ml-11 relative bg-black/60 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">{step.codeType || "Terminal"}</span>
                  </div>
                  
                  <div className="p-4 overflow-x-auto relative">
                    <button 
                      onClick={() => copyToClipboard(step.commands.join('\n'), step.id)}
                      className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                      title="Copy code"
                    >
                      {copiedStep === step.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                    <pre className="font-mono text-sm leading-relaxed pr-10 whitespace-pre">
                      {step.commands.map((cmd, i) => {
                        const isCli = !step.codeType || step.codeType === "cli" || step.codeType === "bash";
                        return (
                          <div key={i} className={`flex ${isCli ? 'gap-4' : ''}`}>
                            {isCli && <span className="text-gray-600 select-none">$</span>}
                            <span className={
                              step.codeType === "terraform" ? "text-purple-300" :
                              step.codeType === "yaml" ? "text-amber-300" :
                              "text-blue-300"
                            }>
                              {cmd}
                            </span>
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>

                {step.validationCmd && (
                  <div className="ml-11 mt-4 flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                    <span className="font-mono">Verify: {step.validationCmd}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="day2" className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
          {project.day2Operations && project.day2Operations.length > 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Standard Operating Procedures (SOPs)</h3>
              <ul className="space-y-4">
                {project.day2Operations.map((op, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {op}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-gray-500 italic p-4">Day 2 operations currently unavailable for this legacy project.</div>
          )}

          {project.troubleshooting && project.troubleshooting.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Incident Response</h3>
              <div className="grid gap-4">
                {project.troubleshooting.map((ts, i) => (
                  <div key={i} className="bg-red-950/20 border border-red-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Shield className="w-5 h-5 text-red-400 shrink-0" />
                      <h4 className="text-lg font-bold text-white leading-tight">{ts.issue}</h4>
                    </div>
                    <p className="text-gray-300 ml-8 p-3 bg-black/30 rounded-lg border border-red-500/10">
                      {ts.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="interview" className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
          <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-6 mb-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Prepare for the Hiring Manager</h3>
            <p className="text-blue-200/70 max-w-2xl mx-auto">
              If you list this project on your resume, you WILL be asked these exact questions in your GCC interviews. Study the reasoning, not just the commands.
            </p>
          </div>

          <div className="grid gap-4">
            {project.interviewQuestions.map((qa, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Badge variant="outline" className={
                    qa.level === "Basic" ? "text-green-400 border-green-400/20 bg-green-400/10 shrink-0 mt-0.5" :
                    qa.level === "Intermediate" ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10 shrink-0 mt-0.5" :
                    "text-red-400 border-red-400/20 bg-red-400/10 shrink-0 mt-0.5"
                  }>
                    {qa.level}
                  </Badge>
                  <h4 className="text-lg font-bold text-white leading-tight">{qa.q}</h4>
                </div>
                <div className="pl-16 relative">
                  <div className="absolute left-[34px] top-0 bottom-0 w-px bg-white/10"></div>
                  <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
                    {qa.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
