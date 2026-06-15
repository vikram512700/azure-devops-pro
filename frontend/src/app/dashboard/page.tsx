import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Target, Activity } from "lucide-react";

export default function Dashboard() {
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
          <StatCard icon={<Trophy className="w-5 h-5 text-yellow-500"/>} title="Total XP" value="2,450" />
          <StatCard icon={<BookOpen className="w-5 h-5 text-blue-500"/>} title="Modules Done" value="4 / 30" />
          <StatCard icon={<Activity className="w-5 h-5 text-emerald-500"/>} title="Labs Finished" value="12" />
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
                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                    Resume Module
                  </button>
                  <button className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-colors">
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
          </div>

          {/* Right Column - Skills Gap & AI Mentor */}
          <div className="space-y-6">
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
                <button className="w-full px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm transition-colors">
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
