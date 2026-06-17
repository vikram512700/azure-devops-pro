"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from "recharts";
import { useEffect, useState } from "react";
import { TrendingUp, Briefcase, Zap, Building2, BarChart3, Users, IndianRupee, Target } from "lucide-react";
import Link from "next/link";

const SALARY_TREND_12M = [
  { month: "Jul '25", junior: 14, mid: 22, senior: 32, lead: 45 },
  { month: "Aug '25", junior: 14, mid: 22, senior: 33, lead: 46 },
  { month: "Sep '25", junior: 15, mid: 23, senior: 34, lead: 47 },
  { month: "Oct '25", junior: 15, mid: 24, senior: 35, lead: 48 },
  { month: "Nov '25", junior: 15, mid: 24, senior: 36, lead: 50 },
  { month: "Dec '25", junior: 16, mid: 25, senior: 37, lead: 52 },
  { month: "Jan '26", junior: 16, mid: 26, senior: 38, lead: 53 },
  { month: "Feb '26", junior: 17, mid: 26, senior: 39, lead: 54 },
  { month: "Mar '26", junior: 17, mid: 27, senior: 40, lead: 56 },
  { month: "Apr '26", junior: 18, mid: 28, senior: 41, lead: 57 },
  { month: "May '26", junior: 18, mid: 28, senior: 42, lead: 58 },
  { month: "Jun '26", junior: 19, mid: 30, senior: 44, lead: 60 },
];

const SALARY_BY_TIER = [
  { company: "FAANG", min: 40, max: 70, avg: 55 },
  { company: "GCC Tier 1", min: 22, max: 48, avg: 34 },
  { company: "GCC Tier 2", min: 15, max: 28, avg: 21 },
  { company: "Consulting", min: 18, max: 34, avg: 26 },
  { company: "Indian MNC", min: 15, max: 28, avg: 22 },
];

const JOB_VOLUME_TREND = [
  { month: "Jan", linkedin: 48, naukri: 72, foundit: 34 },
  { month: "Feb", linkedin: 55, naukri: 80, foundit: 39 },
  { month: "Mar", linkedin: 62, naukri: 88, foundit: 44 },
  { month: "Apr", linkedin: 70, naukri: 95, foundit: 50 },
  { month: "May", linkedin: 85, naukri: 110, foundit: 58 },
  { month: "Jun", linkedin: 102, naukri: 128, foundit: 67 },
];

const ROADMAP_SALARY = [
  { week: "Start",  current: 22, projected: 22, milestone: "Baseline" },
  { week: "Wk 2",  current: 22, projected: 24, milestone: "Terraform" },
  { week: "Wk 4",  current: 22, projected: 27, milestone: "Azure DevOps" },
  { week: "Wk 6",  current: 22, projected: 32, milestone: "AKS Mastery" },
  { week: "Wk 8",  current: 22, projected: 38, milestone: "GitOps + SRE" },
  { week: "Wk 10", current: 22, projected: 44, milestone: "DevSecOps" },
  { week: "Wk 12", current: 22, projected: 50, milestone: "Full Portfolio" },
];

const TOP_GCCS = [
  { name: "Microsoft",    role: "Azure Platform · AKS · DevOps",       openings: 12, isCurrent: false, color: "blue" },
  { name: "Goldman Sachs",role: "Cloud SRE · Kubernetes · GitOps",     openings: 6,  isCurrent: false, color: "emerald" },
  { name: "Jio Platforms",role: "Azure DevOps · Terraform · AKS",      openings: 18, isCurrent: true,  color: "purple" },
  { name: "HSBC GCC",     role: "Azure Security · Kubernetes",         openings: 9,  isCurrent: false, color: "red" },
  { name: "Barclays GCC", role: "Hub-Spoke · Landing Zone · Terraform", openings: 5, isCurrent: false, color: "amber" },
  { name: "Deloitte",     role: "DevSecOps · CI/CD · AKS",            openings: 24, isCurrent: false, color: "cyan" },
];

const SKILL_IMPACT = [
  { skill: "AKS / Kubernetes",    frequency: "Critical",  impact: "+18–22%", jdCount: 487, trend: "+12%", color: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" } },
  { skill: "Terraform / IaC",     frequency: "Critical",  impact: "+12–16%", jdCount: 423, trend: "+8%",  color: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" } },
  { skill: "GitHub Actions",      frequency: "High",      impact: "+10–14%", jdCount: 368, trend: "+15%", color: { bg: "bg-gray-500/10", border: "border-gray-500/20", text: "text-gray-300" } },
  { skill: "GitOps / ArgoCD",     frequency: "Growing",   impact: "+12–15%", jdCount: 215, trend: "+28%", color: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" } },
  { skill: "SRE Practices",       frequency: "Growing",   impact: "+15–18%", jdCount: 198, trend: "+22%", color: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" } },
  { skill: "Azure Monitor / KQL", frequency: "High",      impact: "+8–12%",  jdCount: 312, trend: "+6%",  color: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" } },
  { skill: "DevSecOps",           frequency: "Growing",   impact: "+12–16%", jdCount: 175, trend: "+35%", color: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400" } },
  { skill: "Zero Trust / KV",     frequency: "Emerging",  impact: "+8–10%",  jdCount: 142, trend: "+18%", color: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" } },
  { skill: "Hub-Spoke / Firewall",frequency: "Steady",    impact: "+6–10%",  jdCount: 128, trend: "+4%",  color: { bg: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-400" } },
];

const STATS = [
  { label: "Jobs Scanned",     value: "1,247",  sub: "Jun 2026",     icon: <Briefcase className="w-5 h-5 text-blue-400" /> },
  { label: "Avg Senior Salary",value: "₹44L",   sub: "5–8 yr exp",   icon: <IndianRupee className="w-5 h-5 text-emerald-400" /> },
  { label: "Top Hiring GCC",   value: "Deloitte",sub: "24 openings",  icon: <Building2 className="w-5 h-5 text-purple-400" /> },
  { label: "Fastest Growing",  value: "DevSecOps",sub: "+35% YoY",   icon: <TrendingUp className="w-5 h-5 text-orange-400" /> },
  { label: "Unique Companies", value: "78",      sub: "actively hiring", icon: <Users className="w-5 h-5 text-cyan-400" /> },
  { label: "Highest Bracket",  value: "₹70L",    sub: "FAANG Staff SRE",icon: <Target className="w-5 h-5 text-amber-400" /> },
];

export default function MarketTrendsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 pt-24 max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1 text-sm mb-3">
              <TrendingUp className="w-4 h-4 mr-2 inline" /> Market Intelligence · Jun 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Hyderabad GCC Job Market
            </h1>
            <p className="text-gray-400 mt-2 max-w-3xl">
              Real salary data, hiring velocity, and skill-gap analysis for Azure DevOps / Platform Engineers — sourced from 1,247 active JDs across LinkedIn, Naukri, and Foundit.
            </p>
          </div>
          <Link href="/jobs" className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <Briefcase className="w-4 h-4" />
            View All Jobs
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map((s, i) => (
          <Card key={i} className="bg-white/[0.02] border-white/5">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{s.icon}</div>
              <p className="text-xl font-bold text-white leading-none">{s.value}</p>
              <div>
                <p className="text-xs font-medium text-gray-300">{s.label}</p>
                <p className="text-[10px] text-gray-600">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 12-Month Salary Trend */}
        <Card className="lg:col-span-2 min-w-0 bg-white/[0.02] border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              12-Month Salary Trend by Level (LPA)
            </CardTitle>
            <CardDescription>Junior (3–5yr) · Mid (5–8yr) · Senior (8–12yr) · Lead (12yr+)</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="min-h-[320px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={320}>
                  <LineChart data={SALARY_TREND_12M} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} interval={2} />
                    <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `₹${v}L`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                      itemStyle={{ color: "#e2e8f0" }}
                      labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                      formatter={(v: unknown) => `₹${v}L`}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                    <Line type="monotone" dataKey="junior"  stroke="#64748b" strokeWidth={2} dot={false} name="Junior" />
                    <Line type="monotone" dataKey="mid"     stroke="#3b82f6" strokeWidth={2} dot={false} name="Mid" />
                    <Line type="monotone" dataKey="senior"  stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="Senior" />
                    <Line type="monotone" dataKey="lead"    stroke="#f59e0b" strokeWidth={2.5} dot={false} name="Lead/Staff" />
                  </LineChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Top Hiring GCCs */}
        <Card className="min-w-0 bg-white/[0.02] border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              Top Hiring GCCs
            </CardTitle>
            <CardDescription>Actively posting in Jun 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 min-w-0">
            {TOP_GCCS.map((gcc, idx) => (
              <div key={idx} className={`p-3 rounded-xl border transition-colors ${gcc.isCurrent ? "bg-purple-500/10 border-purple-500/30" : "bg-black/30 border-white/5 hover:border-white/15"}`}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h4 className={`font-bold text-sm truncate ${gcc.isCurrent ? "text-purple-300" : "text-gray-200"}`}>{gcc.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{gcc.role}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-2">
                    <span className="text-sm font-bold text-white">{gcc.openings}</span>
                    <span className="text-[9px] text-gray-600">openings</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Salary by Company Tier */}
        <Card className="min-w-0 bg-white/[0.02] border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
              Salary Range by Company Tier
            </CardTitle>
            <CardDescription>Min · Avg · Max LPA · Hyderabad market</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="min-h-[280px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={280}>
                  <BarChart data={SALARY_BY_TIER} margin={{ top: 5, right: 10, left: 0, bottom: 20 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `₹${v}L`} />
                    <YAxis type="category" dataKey="company" stroke="#475569" tick={{ fill: "#94a3b8", fontSize: 11 }} width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                      itemStyle={{ color: "#e2e8f0" }}
                      formatter={(v: unknown) => `₹${v}L`}
                    />
                    <Bar dataKey="min" fill="#334155" radius={[0, 0, 0, 0]} name="Min" />
                    <Bar dataKey="avg" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Avg" />
                    <Bar dataKey="max" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Max" />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Job Volume Trend */}
        <Card className="min-w-0 bg-white/[0.02] border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Monthly Job Posting Volume
            </CardTitle>
            <CardDescription>LinkedIn · Naukri · Foundit · H1 2026</CardDescription>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="min-h-[280px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={280}>
                  <AreaChart data={JOB_VOLUME_TREND} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gLi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gNa" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gFo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                      itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                    <Area type="monotone" dataKey="linkedin" stroke="#3b82f6" strokeWidth={2} fill="url(#gLi)" name="LinkedIn" />
                    <Area type="monotone" dataKey="naukri"   stroke="#f59e0b" strokeWidth={2} fill="url(#gNa)" name="Naukri" />
                    <Area type="monotone" dataKey="foundit"  stroke="#8b5cf6" strokeWidth={2} fill="url(#gFo)" name="Foundit" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap Salary Projection */}
      <Card className="min-w-0 bg-white/[0.02] border-white/5 shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              Your Salary Trajectory — Azure DevOps Roadmap
            </CardTitle>
            <CardDescription>Projected LPA uplift as you complete the 12-week learning path</CardDescription>
          </div>
          <Link href="/roadmap" className="text-xs text-blue-400 hover:text-blue-300 shrink-0 mt-1 transition-colors">
            View Roadmap →
          </Link>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="min-h-[280px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={280}>
                <AreaChart data={ROADMAP_SALARY} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gProj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="week" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `₹${v}L`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                    itemStyle={{ color: "#e2e8f0" }}
                    formatter={(v: unknown) => `₹${v}L`}
                  />
                  <Area type="monotone" dataKey="current"   stroke="#475569" strokeWidth={1.5} fill="none"         strokeDasharray="4 4" name="Current Baseline" />
                  <Area type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={3}   fill="url(#gProj)"  name="Projected Salary" />
                </AreaChart>
              </ResponsiveContainer>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/5">
            {ROADMAP_SALARY.filter((_, i) => i > 0).map((m, i) => (
              <div key={i} className="text-center">
                <p className="text-xs text-gray-600">{m.week}</p>
                <p className="text-sm font-bold text-blue-400">₹{m.projected}L</p>
                <p className="text-[10px] text-gray-600">{m.milestone}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Impact Grid */}
      <Card className="bg-white/[0.02] border-white/5 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Skill vs. Salary Impact
          </CardTitle>
          <CardDescription>Extracted from 1,247 Hyderabad Azure DevOps JDs · Jun 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILL_IMPACT.map((skill, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${skill.color.bg} ${skill.color.border}`}>
                <div>
                  <h4 className={`font-bold text-sm ${skill.color.text}`}>{skill.skill}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {skill.jdCount} JDs · <span className="text-gray-400">{skill.frequency}</span>
                  </p>
                  <p className="text-xs text-emerald-500 font-medium mt-0.5">↑ {skill.trend} YoY</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={`border-white/10 bg-black/40 ${skill.color.text} font-mono text-sm`}>
                    {skill.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
