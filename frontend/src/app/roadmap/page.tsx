"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { ArrowRight, BookOpen, Cloud, GitBranch, Layers3, ShieldCheck, Sparkles, Target, Trophy, Zap } from "lucide-react";

type Stage = {
  name: string;
  title: string;
  summary: string;
  color: string;
  accent: string;
  modules: { id: number; title: string; desc: string }[];
};

const STAGES: Stage[] = [
  {
    name: "Foundation",
    title: "Stage 1 · Cloud Foundations",
    summary: "Learn how Azure is organized before you try to automate or scale anything.",
    color: "from-blue-500/20 to-cyan-500/5",
    accent: "text-blue-300",
    modules: [
      { id: 1, title: "Regions & Resource Groups", desc: "Start with geography, lifecycle, and tagging." },
      { id: 2, title: "Subscriptions & CLI", desc: "Understand access, billing, and terminal control." },
      { id: 3, title: "VNets & Peering", desc: "Build the network boundary that everything else uses." },
      { id: 4, title: "NSGs & Firewalls", desc: "Control traffic with rules and routing." },
      { id: 5, title: "VMs & VMSS", desc: "Learn compute primitives and scaling patterns." },
      { id: 6, title: "App Service & Functions", desc: "Move from servers to managed platform delivery." },
    ],
  },
  {
    name: "Containers",
    title: "Stage 2 · Containers & AKS",
    summary: "Package apps, secure images, and deploy workloads on Kubernetes the right way.",
    color: "from-emerald-500/20 to-teal-500/5",
    accent: "text-emerald-300",
    modules: [
      { id: 7, title: "Docker Basics", desc: "Build and run your first container image." },
      { id: 8, title: "Multi-Stage Builds", desc: "Reduce image size and attack surface." },
      { id: 9, title: "ACR", desc: "Store and distribute private images." },
      { id: 10, title: "AKS Control Plane", desc: "Understand the moving parts of a managed cluster." },
      { id: 11, title: "Pods & Services", desc: "Deploy and expose workloads cleanly." },
      { id: 12, title: "Ingress Routing", desc: "Route traffic with TLS and path rules." },
      { id: 13, title: "HPA & Network Policies", desc: "Scale safely and protect internal traffic." },
    ],
  },
  {
    name: "Delivery",
    title: "Stage 3 · Git & Delivery Pipelines",
    summary: "Turn every commit into a releasable unit with clear gating and rollback thinking.",
    color: "from-violet-500/20 to-fuchsia-500/5",
    accent: "text-violet-300",
    modules: [
      { id: 14, title: "Git Fundamentals", desc: "Branching, collaboration, and recovery." },
      { id: 15, title: "GitHub Actions", desc: "Build workflows that actually ship code." },
      { id: 16, title: "Azure Pipelines", desc: "Practice enterprise pipeline structure." },
      { id: 17, title: "Release Gates", desc: "Control the path into staging and prod." },
      { id: 18, title: "Terraform Basics", desc: "Define infrastructure as reviewable code." },
      { id: 19, title: "Terraform Modules", desc: "Reuse and standardize infrastructure patterns." },
      { id: 20, title: "Bicep & ARM", desc: "See Microsoft-native IaC patterns too." },
    ],
  },
  {
    name: "Operations",
    title: "Stage 4 · Security, Observability & Production Readiness",
    summary: "Finish with identity, secrets, monitoring, FinOps, and resilience under pressure.",
    color: "from-amber-500/20 to-red-500/5",
    accent: "text-amber-300",
    modules: [
      { id: 21, title: "Entra ID & RBAC", desc: "Lock down access properly." },
      { id: 22, title: "Key Vault & CSI", desc: "Handle secrets the right way." },
      { id: 23, title: "Storage", desc: "Choose the right storage pattern." },
      { id: 24, title: "Monitor & Alerts", desc: "See problems before users do." },
      { id: 25, title: "Log Analytics & KQL", desc: "Query the story behind incidents." },
      { id: 26, title: "Helm", desc: "Package Kubernetes workloads for teams." },
      { id: 27, title: "ArgoCD", desc: "Make Git the source of truth." },
      { id: 28, title: "FinOps & Policy", desc: "Control spend and enforce guardrails." },
      { id: 29, title: "Chaos Studio", desc: "Prove the system survives failure." },
      { id: 30, title: "Game Day", desc: "Run the full production story end to end." },
    ],
  },
];

const HIGHLIGHTS = [
  { icon: <Cloud className="w-4 h-4 text-blue-300" />, label: "Cloud-first", value: "Azure-first learning path" },
  { icon: <GitBranch className="w-4 h-4 text-violet-300" />, label: "Delivery flow", value: "Commit → build → ship" },
  { icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, label: "Production mindset", value: "Security, scale, and recovery" },
  { icon: <Trophy className="w-4 h-4 text-amber-300" />, label: "Finish line", value: "Portfolio-ready outcomes" },
];

export default function Roadmap() {
  const { progress, isLoaded } = useProgress();
  const completedCount = isLoaded ? progress.completedModules.length : 0;
  const progressPct = Math.round((completedCount / 30) * 100);
  const nextModule = Array.from({ length: 30 }, (_, i) => String(i + 1)).find(id => !progress.completedModules.includes(id)) ?? "30";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-8%] right-[-8%] w-[34rem] h-[34rem] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute bottom-[-8%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)] opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_30%)]" />
            <div className="relative">
              <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 px-3 py-1 text-sm">
                Curriculum Roadmap
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
                A guided path from basics to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-300">
                  production-ready Azure DevOps
                </span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
                Learn in stages, finish with projects, and build the habit of proving what you deployed, how you validated it, and why it matters in production.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
                {HIGHLIGHTS.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-blue-300" />
                  Progress Snapshot
                </CardTitle>
                <CardDescription>What your learning journey looks like right now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">{progressPct}%</p>
                    <p className="text-sm text-gray-400">of 30 modules completed</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {completedCount} done
                  </Badge>
                </div>
                <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Next module</span>
                  <Link href={`/module/${nextModule}`} className="text-blue-300 hover:text-blue-200 inline-flex items-center gap-1">
                    Open Module {nextModule} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="w-5 h-5 text-amber-300" />
                  What to finish
                </CardTitle>
                <CardDescription>Each stage builds toward a clear outcome</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 leading-relaxed space-y-2">
                <p>1. Learn the foundation.</p>
                <p>2. Build the delivery stack.</p>
                <p>3. Ship projects that prove your skill.</p>
                <p>4. Finish with monitoring, security, and recovery.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6">
          {STAGES.map((stage, stageIndex) => (
            <Card key={stage.title} className="bg-white/[0.03] border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className={`h-1 bg-gradient-to-r ${stage.color}`} />
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                  <div>
                    <div className={`inline-flex items-center gap-2 text-sm font-semibold ${stage.accent} mb-2`}>
                      <Layers3 className="w-4 h-4" />
                      {stage.name}
                    </div>
                    <CardTitle className="text-2xl text-white">{stage.title}</CardTitle>
                    <CardDescription className="text-base mt-2 max-w-3xl">{stage.summary}</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit bg-white/5 text-gray-300 border-white/10">
                    {stage.modules.length} modules
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {stage.modules.map((module) => {
                    const completed = isLoaded && progress.completedModules.includes(module.id.toString());
                    const locked = isLoaded && module.id > 1 && !progress.completedModules.includes((module.id - 1).toString()) && !completed;

                    return (
                      <Link
                        key={module.id}
                        href={`/module/${module.id}`}
                        className={`group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                          completed
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : locked
                              ? "border-white/5 bg-black/20 opacity-60 grayscale-[0.4]"
                              : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-sm font-bold text-white">
                              {module.id}
                            </span>
                            <div>
                              <p className="text-white font-semibold leading-snug">{module.title}</p>
                              <p className="text-xs text-gray-500 mt-1">Module {module.id}</p>
                            </div>
                          </div>
                          {completed ? (
                            <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">Done</Badge>
                          ) : locked ? (
                            <Badge className="bg-white/5 text-gray-400 border border-white/10">Locked</Badge>
                          ) : (
                            <Badge className="bg-blue-500/15 text-blue-300 border border-blue-500/20">Next</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{module.desc}</p>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-300" />
                How to use it
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 leading-relaxed">
              Follow the stages in order, finish each module, then move into the projects that prove the skill in a real scenario.
            </CardContent>
          </Card>
          <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300" />
                What good progress looks like
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 leading-relaxed">
              You should always know the next module, the next project, and the next reason your learning matters in production.
            </CardContent>
          </Card>
          <Card className="bg-white/[0.03] border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-300" />
                End goal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-300 leading-relaxed">
              Finish with enough depth to explain architecture, validate deployments, and defend your choices in a senior interview.
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
