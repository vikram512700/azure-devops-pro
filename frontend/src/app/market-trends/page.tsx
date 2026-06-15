"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Briefcase, Zap, Building2, BarChart3 } from "lucide-react";

// Mock Data from Implementation Plan
const SALARY_DATA = [
  { month: 'Start', base: 12, projected: 12, milestone: 'Baseline' },
  { month: 'Week 2', base: 12, projected: 14, milestone: 'Terraform' },
  { month: 'Week 4', base: 12, projected: 16, milestone: 'Azure DevOps' },
  { month: 'Week 6', base: 12, projected: 20, milestone: 'AKS Mastery' },
  { month: 'Week 8', base: 12, projected: 24, milestone: 'SRE + GitOps' },
];

const TOP_GCCS = [
  { name: "Microsoft", role: "Azure Platform, AKS, DevOps", isCurrent: false },
  { name: "Amazon AWS", role: "Cloud Infra (Azure bilingual)", isCurrent: false },
  { name: "Jio Platforms", role: "Azure DevOps, Terraform, AKS", isCurrent: true },
  { name: "HSBC GCC", role: "Azure Security, Kubernetes", isCurrent: false },
  { name: "Deloitte", role: "Azure DevOps, Terraform, CI/CD", isCurrent: false },
  { name: "Capgemini", role: "AKS, Azure Monitor, SRE", isCurrent: false },
];

const SKILL_IMPACT = [
  { skill: "AKS", frequency: "High", impact: "+15–20%", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  { skill: "Terraform", frequency: "High", impact: "+10–15%", bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  { skill: "SRE practices", frequency: "Growing", impact: "+15%", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  { skill: "GitOps (ArgoCD)", frequency: "Growing", impact: "+12%", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
  { skill: "Azure Monitor/KQL", frequency: "Medium", impact: "+8%", bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  { skill: "Key Vault", frequency: "Medium", impact: "+5%", bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
];

export default function MarketTrendsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 pt-24 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-4 mb-12">
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 text-sm">
          <TrendingUp className="w-4 h-4 mr-2 inline" /> Market Intelligence
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Hyderabad GCC Job Market</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Real-time salary trends, hiring companies, and skill-gap analysis specifically tailored for Azure DevOps and Platform Engineers in Hyderabad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart - Takes up 2 columns on lg */}
        <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              8-Week Salary Trajectory
            </CardTitle>
            <CardDescription className="text-gray-400">
              Projected LPA (Lakhs Per Annum) growth as you complete the Azure roadmap modules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALARY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
                  <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickFormatter={(value) => `₹${value}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                  />
                  <Area type="monotone" dataKey="base" stroke="#64748b" fillOpacity={1} fill="url(#colorBase)" name="Baseline LPA" />
                  <Area type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProjected)" name="Projected LPA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top GCCs List */}
        <Card className="bg-white/[0.02] border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Top Hiring GCCs
            </CardTitle>
            <CardDescription>Actively hiring for these roles in H2 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TOP_GCCS.map((gcc, idx) => (
              <div key={idx} className={`p-4 rounded-xl border transition-colors ${gcc.isCurrent ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-bold ${gcc.isCurrent ? 'text-purple-400' : 'text-gray-200'}`}>
                      {gcc.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {gcc.role}
                    </p>
                  </div>
                  {gcc.isCurrent && (
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-[10px]">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skill Impact Table - Full Width */}
        <Card className="lg:col-span-3 bg-white/[0.02] border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              Skill vs. Salary Impact
            </CardTitle>
            <CardDescription>Extracted from 500+ recent Hyderabad DevOps Job Descriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKILL_IMPACT.map((skill, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${skill.bg} ${skill.border}`}>
                  <div>
                    <h4 className={`font-bold ${skill.text}`}>{skill.skill}</h4>
                    <p className="text-xs text-gray-400 mt-1">Frequency: <span className="text-gray-300">{skill.frequency}</span></p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={`bg-black/40 border-white/10 ${skill.text} font-mono text-sm`}>
                      {skill.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
