"use client";

import { useState } from "react";
import { Project } from "@/data/projects";
import { useProgress } from "@/hooks/useProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, CheckCircle2, Circle, Clock, Briefcase, ChevronRight, 
  Terminal, Server, Network, Shield, Copy, Check, Sparkles, BrainCircuit, TrendingUp, Radar, ShieldAlert,
  FileText, PlayCircle, ClipboardList, Rocket, Target, Layers3
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function getProductionImpact(project: Project): string {
  if (project.productionImpact) return project.productionImpact;
  if (project.businessContext) return project.businessContext;
  return "This project matters in production because it demonstrates how the platform behaves under real delivery, reliability, and operational pressure.";
}

function getProductionRisk(project: Project): string {
  if (project.troubleshooting?.[0]?.issue) return project.troubleshooting[0].issue;
  if (project.costAnalysis) return project.costAnalysis.split(".")[0];
  return "Production issues usually start with weak isolation, unclear ownership, or missing validation.";
}

function getProductionValue(project: Project): string {
  if (project.businessContext) return project.businessContext;
  return project.productionImpact ?? "This work proves the team can ship something real and explain why it matters.";
}

function getOpsImpact(project: Project): string {
  if (project.day2Operations?.[0]) return project.day2Operations[0];
  if (project.costAnalysis) return project.costAnalysis;
  return "Day-2 impact shows up in supportability, recovery, and how easy the system is to run.";
}

export default function ProjectClient({ project }: { project: Project }) {
  const router = useRouter();
  const { isProjectCompleted, markProjectCompleted } = useProgress();
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const isDone = isProjectCompleted(project.id);
  const totalSteps = project.steps.length;
  const firstStep = project.steps[0];
  const lastStep = project.steps[project.steps.length - 1];
  const phaseNames = [
    "Design the target state",
    "Provision the foundation",
    "Deploy the workload",
    "Validate and harden",
    "Ship the finished project",
  ];

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
          <TabsTrigger value="plan" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Build Plan</TabsTrigger>
          <TabsTrigger value="architecture" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Architecture</TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Business & Cost</TabsTrigger>
          <TabsTrigger value="steps" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Execution</TabsTrigger>
          <TabsTrigger value="finish" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">Finish Line</TabsTrigger>
          <TabsTrigger value="ai-ops" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none px-6 py-3">AI Ops Intelligence</TabsTrigger>
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

          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-3">Why This Matters in Production</h3>
            <p className="text-gray-300 leading-relaxed max-w-4xl">
              {getProductionImpact(project)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-red-300 mb-2">Risk</p>
                <p className="text-sm text-gray-200 leading-relaxed">{getProductionRisk(project)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300 mb-2">Business Value</p>
                <p className="text-sm text-gray-200 leading-relaxed">{getProductionValue(project)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300 mb-2">Ops Impact</p>
                <p className="text-sm text-gray-200 leading-relaxed">{getOpsImpact(project)}</p>
              </div>
            </div>
          </div>
          
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-3 text-white">
                <PlayCircle className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold">What you will actually finish</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                You are not just learning concepts here. By the end, you should have a working solution, a repeatable deployment path, and evidence you can show in interviews.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-3 text-white">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold">Portfolio evidence</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Use the architecture diagram, deployed artifacts, and interview answers as proof that you can take a project from planning to production readiness.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-3 text-white">
                <Rocket className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold">Definition of done</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Finished means deployed, validated, documented, and explainable end to end. If you can demo it and defend the design, you are done.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Layers3 className="w-5 h-5 text-blue-400" />
              End-to-End Build Plan
            </h3>
            <p className="text-gray-400 max-w-3xl leading-relaxed mb-6">
              This tab shows the full delivery path so you can finish the project like an engineer, not just run commands. Start with the target architecture, build the infrastructure, validate the output, then package the result for your portfolio and interview story.
            </p>

            <div className="grid gap-4">
              {phaseNames.map((phase, i) => {
                const step = project.steps[i];
                return (
                  <div key={phase} className="flex gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-300 font-bold">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold">{phase}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {step
                          ? `${step.title}: ${step.description}`
                          : "Finalize the deployment, capture screenshots/logs, and write down what you built."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Start point</p>
                <p className="text-sm text-white font-medium">{firstStep ? firstStep.title : "Project kickoff"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total steps</p>
                <p className="text-sm text-white font-medium">{totalSteps} guided actions</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">End point</p>
                <p className="text-sm text-white font-medium">{lastStep ? lastStep.title : "Validated deployment"}</p>
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
          <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-6 mb-2">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              How to finish this project
            </h3>
            <p className="text-blue-200/75 text-sm leading-relaxed">
              Execute the steps in order, verify each output, and keep one final proof artifact: screenshot, command output, or deployed URL. That proof is what turns the lab into a portfolio project.
            </p>
          </div>

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

        <TabsContent value="finish" className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
          <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              Finish Line
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl mb-6">
              This is the point where the project stops being a tutorial and becomes portfolio evidence. You should be able to show what you deployed, how you validated it, and why it matters in a real enterprise environment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">What you deploy</p>
                <p className="text-sm text-white font-medium leading-relaxed">
                  {project.deliverables.length > 0
                    ? project.deliverables.join(" · ")
                    : "A working, production-style implementation based on the project architecture."}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">How you validate</p>
                <p className="text-sm text-white font-medium leading-relaxed">
                  Run the final validation step, confirm the expected output, and capture one proof artifact such as a screenshot, URL, or command output.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Interview proof</p>
                <p className="text-sm text-white font-medium leading-relaxed">
                  Explain the architecture, tradeoffs, and why the design fits a real GCC or platform engineering role.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                "The target resource is deployed and reachable.",
                "The architecture diagram matches what you built.",
                "Validation commands prove the setup is working.",
                "You can explain the business reason for every component.",
                "You have one portfolio artifact to show in interviews.",
                "You can rebuild the same outcome from scratch."
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-gray-300 bg-black/20 border border-white/5 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Completion rule</p>
              <p className="text-sm text-gray-300 leading-relaxed">
                If you can deploy it, validate it, and explain it without looking at the page, you have finished the project.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-ops" className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
          <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-6 text-center">
            <h3 className="flex items-center justify-center gap-2 text-xl font-bold text-white mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI Mentor Operations Analysis
            </h3>
            <p className="text-blue-200/70 max-w-2xl mx-auto">
              Our AI has scanned this project's architecture to generate proactive intelligence for scalability, day-2 operations, and predictive incident response.
            </p>
          </div>

          {project.day2Operations && project.day2Operations.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 p-4 opacity-10">
                <BrainCircuit className="w-48 h-48 text-blue-500" />
              </div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-6 relative z-10">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                AI Scalability & Automation Insights
              </h3>
              <div className="grid gap-4 md:grid-cols-2 relative z-10">
                {project.day2Operations.map((op, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-relaxed">{op}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.troubleshooting && project.troubleshooting.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-6 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 p-4 opacity-10">
                <Radar className="w-48 h-48 text-red-500" />
              </div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-6 relative z-10">
                <ShieldAlert className="w-6 h-6 text-red-400" />
                Predictive Incident Response
              </h3>
              <div className="grid gap-6 relative z-10">
                {project.troubleshooting.map((ts, i) => (
                  <div key={i} className="bg-red-950/10 border border-red-500/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-red-500/10 border-b border-red-500/10 px-6 py-4 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-red-400 shrink-0" />
                      <h4 className="text-base font-bold text-white">{ts.issue}</h4>
                    </div>
                    <div className="p-6 bg-black/20">
                      <div className="flex gap-3">
                        <Terminal className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {ts.solution}
                        </p>
                      </div>
                    </div>
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
