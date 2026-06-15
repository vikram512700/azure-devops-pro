"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Target, Activity, Settings2, Key, Shield, Medal, Crown } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { useSettings } from "@/hooks/useSettings";

export default function Dashboard() {
  const { progress, isLoaded, unlockedBadges } = useProgress();
  const { apiKey, saveApiKey, isLoaded: settingsLoaded } = useSettings();
  
  const iconMap: Record<string, React.ReactNode> = {
    Shield: <Shield className="w-8 h-8 text-blue-400" />,
    Medal: <Medal className="w-8 h-8 text-emerald-400" />,
    Trophy: <Trophy className="w-8 h-8 text-yellow-400" />,
    Crown: <Crown className="w-8 h-8 text-purple-400" />
  };
  return (
    <div className="min-h-screen p-8 pt-24 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back, Engineer</h1>
            <p className="text-muted-foreground mt-1">Here's your progress on the Azure DevOps journey.</p>
          </div>
          <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Level 5 Explorer
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<Trophy className="w-5 h-5 text-yellow-500"/>} title="Total XP" value={isLoaded ? progress.xp.toString() : "..."} />
          <StatCard icon={<BookOpen className="w-5 h-5 text-blue-500"/>} title="Modules Done" value={isLoaded ? `${progress.completedModules.length} / 30` : "..."} />
          <StatCard icon={<Activity className="w-5 h-5 text-emerald-500"/>} title="Labs Finished" value="0" />
          <StatCard icon={<Target className="w-5 h-5 text-purple-500"/>} title="Current Track" value="Networking" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-white">Continue Learning</h2>
            <Card className="bg-white/[0.02] border-white/[0.05] overflow-hidden group">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-transparent">
                <CardTitle>Azure Virtual Networks (VNET)</CardTitle>
                <CardDescription>Track 2: Azure Networking</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                  <span>Progress</span>
                  <span className="text-blue-400 font-medium">60%</span>
                </div>
                <Progress value={60} className="h-2 bg-white/5" />
                <div className="mt-6 flex gap-4">
                  <button className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-0.5">
                    Resume Module
                  </button>
                  <button className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    View Lab
                  </button>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-semibold text-white pt-4">Recent Activity</h2>
            <div className="space-y-4">
               {/* Mock Activities */}
               <ActivityRow title="Completed Quiz: Azure Regions" time="2 hours ago" score="90%" />
               <ActivityRow title="Finished Lab: Create Resource Group" time="Yesterday" />
               <ActivityRow title="Started Module: VNET Architecture" time="2 days ago" />
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
                  <p className="text-muted-foreground text-sm">Earn XP to unlock your first badge!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Skills Gap & AI Mentor & Settings */}
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
                  Paste your free Google Gemini API Key to unlock the AI Interviewer and JD Analyzer. Your key is securely stored in your browser's local storage.
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

            <h2 className="text-xl font-semibold text-white">Market Intel</h2>
            <Card className="bg-white/[0.02] border-white/[0.05]">
              <CardHeader>
                <CardTitle className="text-lg">Hyderabad Top Skills</CardTitle>
                <CardDescription>Based on 500+ recent job descriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SkillBar name="AKS" demand={95} userHas={false} />
                <SkillBar name="Terraform" demand={88} userHas={true} />
                <SkillBar name="Azure DevOps" demand={82} userHas={true} />
                <SkillBar name="Docker" demand={75} userHas={true} />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-100">AI Mentor</CardTitle>
                <CardDescription className="text-indigo-200/60">Ready to practice?</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-indigo-100/80 mb-4">
                  Schedule a Level 2 mock interview focusing on Networking scenarios.
                </p>
                <button className="w-full h-12 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:-translate-y-0.5">
                  Start Mock Interview
                </button>
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
  )
}

function ActivityRow({ title, time, score }: { title: string, time: string, score?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.01] border border-white/[0.05]">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      {score && <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">{score}</Badge>}
    </div>
  )
}

function SkillBar({ name, demand, userHas }: { name: string, demand: number, userHas: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-200">{name}</span>
        {userHas ? 
          <span className="text-emerald-400 text-xs flex items-center gap-1">Acquired</span> : 
          <span className="text-amber-400 text-xs flex items-center gap-1">Gap</span>
        }
      </div>
      <Progress value={demand} className="h-1.5 bg-white/5" indicatorClassName={userHas ? "bg-emerald-500" : "bg-amber-500"} />
    </div>
  )
}
