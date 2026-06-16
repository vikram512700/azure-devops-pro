"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Target, Award, Settings2, Key, Shield, Medal, Crown, CheckCircle2, Download, Upload, Database } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { useSettings } from "@/hooks/useSettings";
import { modulesData } from "@/data/modules";

const ALL_IDS = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

const MARKET_SKILLS = [
  { name: "AKS / Kubernetes", demand: 95, moduleId: "10", projectId: "p7" },
  { name: "Terraform", demand: 88, moduleId: "18", projectId: "p15" },
  { name: "CI/CD Pipelines", demand: 82, moduleId: "16", projectId: "p6" },
  { name: "Docker", demand: 75, moduleId: "7", projectId: "p5" },
  { name: "Landing Zone", demand: 70, moduleId: "22", projectId: "p10" },
  { name: "GitOps / ArgoCD", demand: 65, moduleId: "27", projectId: "p8" },
  { name: "Zero Trust Security", demand: 60, moduleId: "21", projectId: "p19" },
  { name: "Observability", demand: 55, moduleId: "24", projectId: "p9" },
];

export default function Dashboard() {
  const { progress, isLoaded, unlockedBadges, exportProgress, importProgress } = useProgress();
  const { apiKey, saveApiKey, isLoaded: settingsLoaded } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = importProgress(event.target?.result as string);
        if (result) {
          alert("Progress imported successfully! Reloading...");
          window.location.reload();
        } else {
          alert("Invalid progress file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const iconMap: Record<string, React.ReactNode> = {
    Shield: <Shield className="w-8 h-8 text-blue-400" />,
    Medal: <Medal className="w-8 h-8 text-emerald-400" />,
    Trophy: <Trophy className="w-8 h-8 text-yellow-400" />,
    Crown: <Crown className="w-8 h-8 text-purple-400" />,
  };

  // --- Derived, real progress state ---
  const completed = progress.completedModules;
  const completedCount = completed.length;
  const overallPct = Math.round((completedCount / 30) * 100);
  const level = Math.floor(progress.xp / 200) + 1;
  const rank = unlockedBadges.length ? unlockedBadges[unlockedBadges.length - 1].name : "Explorer";

  const nextId = ALL_IDS.find((id) => !completed.includes(id)) ?? "30";
  const nextModule = modulesData[nextId];
  const allDone = completedCount === 30;

  // Most recent completions (last 3), newest first
  const recent = [...completed].reverse().slice(0, 3);

  return (
    <div className="min-h-screen p-8 pt-24 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, Engineer</h1>
            <p className="text-muted-foreground mt-1">Here&apos;s your progress on the Azure DevOps journey.</p>
          </div>
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {isLoaded ? `Level ${level} · ${rank}` : "Level 1 · Explorer"}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<Trophy className="w-5 h-5 text-yellow-500" />} title="Total XP" value={isLoaded ? progress.xp.toString() : "..."} />
          <StatCard icon={<BookOpen className="w-5 h-5 text-blue-500" />} title="Modules Done" value={isLoaded ? `${completedCount} / 30` : "..."} />
          <StatCard icon={<Award className="w-5 h-5 text-emerald-500" />} title="Badges Earned" value={isLoaded ? `${unlockedBadges.length} / 4` : "..."} />
          <StatCard icon={<Target className="w-5 h-5 text-purple-500" />} title="Overall Progress" value={isLoaded ? `${overallPct}%` : "..."} />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-white">{allDone ? "Curriculum Complete 🎉" : "Continue Learning"}</h2>
            <Card className="bg-white/[0.02] border-white/[0.05] overflow-hidden group">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-transparent">
                <CardTitle>{allDone ? "All 30 modules complete!" : nextModule?.title}</CardTitle>
                <CardDescription>{allDone ? "Revisit any track to sharpen your skills." : `Module ${nextId}: ${nextModule?.subtitle}`}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                  <span>Overall journey ({completedCount} / 30 modules)</span>
                  <span className="text-blue-400 font-medium">{overallPct}%</span>
                </div>
                <Progress value={overallPct} className="h-2 bg-white/5" />
                <div className="mt-6 flex gap-4">
                  <Link href={`/module/${allDone ? "1" : nextId}`} className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-0.5">
                    {allDone ? "Review Modules" : completedCount === 0 ? "Start Learning" : "Resume Module"}
                  </Link>
                  <Link href="/roadmap" className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    View Roadmap
                  </Link>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold text-white pt-4">Recent Activity</h2>
            <div className="space-y-4">
              {isLoaded && recent.length > 0 ? (
                recent.map((id) => (
                  <ActivityRow key={id} title={`Completed: ${modulesData[id]?.title ?? `Module ${id}`}`} detail={modulesData[id]?.subtitle ?? ""} />
                ))
              ) : (
                <div className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-lg border-dashed">
                  <p className="text-muted-foreground text-sm">No activity yet — finish a module quiz to start earning XP and tracking progress.</p>
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold text-white pt-4">Achievements & Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoaded && unlockedBadges.map(badge => (
                <Card key={badge.id} className="bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 text-center flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform cursor-default">
                  <div className="p-4 rounded-full bg-black/20 mb-3 shadow-inner">
                    {iconMap[badge.icon] || <Trophy className="w-8 h-8 text-yellow-400" />}
                  </div>
                  <h3 className="text-sm font-bold text-white">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
                </Card>
              ))}
              {isLoaded && unlockedBadges.length === 0 && (
                <div className="col-span-2 md:col-span-4 text-center p-8 bg-white/[0.02] border border-white/5 rounded-lg border-dashed">
                  <p className="text-muted-foreground text-sm">Earn XP to unlock your first badge (Cloud Rookie at 100 XP)!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Settings, Skills & AI Mentor */}
          <div className="space-y-6">

            <Card className="bg-white/[0.02] border-white/[0.05]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-gray-400" />
                  AI Settings
                </CardTitle>
                <CardDescription>Bring Your Own AI (Gemini)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Paste your free Google Gemini API Key to unlock the AI Interviewer and JD Analyzer. Your key is securely stored in your browser&apos;s local storage.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      className="w-full bg-black/40 border border-white/10 rounded-md pl-9 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                      value={settingsLoaded ? apiKey : ""}
                      onChange={(e) => saveApiKey(e.target.value)}
                    />
                  </div>
                </div>
                {apiKey && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">API Key Saved</Badge>}
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/[0.05] mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5 text-gray-400" />
                  Data Management
                </CardTitle>
                <CardDescription>Backup your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Your progress is saved locally. Export it to back it up or move between devices.
                </p>
                <div className="flex gap-2">
                  <button onClick={exportProgress} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md text-sm transition-all border border-white/10">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-md text-sm transition-all border border-white/10">
                    <Upload className="w-4 h-4" /> Import
                  </button>
                  <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold text-white mt-6 pt-4">Market Intel</h2>
            <Card className="bg-white/[0.02] border-white/[0.05]">
              <CardHeader>
                <CardTitle className="text-lg">Hyderabad Top Skills</CardTitle>
                <CardDescription>Demand vs. what you&apos;ve covered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MARKET_SKILLS.map((s) => (
                  <SkillBar 
                    key={s.name} 
                    name={s.name} 
                    demand={s.demand} 
                    userHas={isLoaded && progress.completedModules.includes(s.moduleId)} 
                    userProven={isLoaded && progress.completedProjects.includes(s.projectId)}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-100">AI Mentor</CardTitle>
                <CardDescription className="text-indigo-200/60">Ready to practice?</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-100/80 mb-4">
                  {allDone
                    ? "Run a full mock interview to validate everything you've learned."
                    : `Practice a mock interview on ${nextModule?.subtitle ?? "Azure DevOps"} scenarios — needs your Gemini key.`}
                </p>
                <Link href="/interview" className="flex items-center justify-center w-full h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:-translate-y-0.5">
                  Start Mock Interview
                </Link>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <Card className="bg-white/[0.02] border-white/[0.05]">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-white/[0.05]">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityRow({ title, detail }: { title: string, detail?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.01] border border-white/[0.05]">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
        </div>
      </div>
      <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">+100 XP</Badge>
    </div>
  );
}

function SkillBar({ name, demand, userHas, userProven }: { name: string, demand: number, userHas: boolean, userProven: boolean }) {
  let statusText = "To Learn";
  let statusColor = "text-amber-400";
  let indicatorColor = "bg-amber-500";
  
  if (userProven) {
    statusText = "Proven ✅";
    statusColor = "text-green-400 font-bold";
    indicatorColor = "bg-green-500";
  } else if (userHas) {
    statusText = "Covered";
    statusColor = "text-emerald-400";
    indicatorColor = "bg-emerald-500";
  }

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-200">{name}</span>
        <span className={`${statusColor} text-xs flex items-center gap-1`}>{statusText}</span>
      </div>
      <Progress value={demand} className="h-1.5 bg-white/5" indicatorClassName={indicatorColor} />
    </div>
  );
}
