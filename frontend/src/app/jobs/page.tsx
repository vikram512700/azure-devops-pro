"use client";

import { useState, useMemo } from "react";
import {
  jobsData, JobSource, ExperienceBand, CompanyTier,
  JOB_SOURCES, EXPERIENCE_BANDS, COMPANY_TIERS
} from "@/data/jobs";
import { useProgress } from "@/hooks/useProgress";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase, Clock, MapPin, RefreshCw, ExternalLink,
  TrendingUp, Building2, Search, SlidersHorizontal, Star, Users
} from "lucide-react";

const TIER_COLORS: Record<CompanyTier, string> = {
  "FAANG":       "text-violet-400 border-violet-400/20 bg-violet-400/10",
  "GCC-Tier1":   "text-blue-400 border-blue-400/20 bg-blue-400/10",
  "GCC-Tier2":   "text-cyan-400 border-cyan-400/20 bg-cyan-400/10",
  "Consulting":  "text-amber-400 border-amber-400/20 bg-amber-400/10",
  "Indian-MNC":  "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
};

const SOURCE_COLORS: Record<JobSource, string> = {
  "LinkedIn": "text-blue-300 border-blue-300/30 bg-blue-300/10",
  "Naukri":   "text-orange-300 border-orange-300/30 bg-orange-300/10",
  "Foundit":  "text-purple-300 border-purple-300/30 bg-purple-300/10",
};

function getMatchPct(job: ReturnType<typeof jobsData[number]["requiredModuleIds"]["filter"]> extends never ? never : typeof jobsData[number], completedModules: string[], completedProjects: string[]): number {
  const totalRequired = job.requiredModuleIds.length + job.requiredProjectIds.length;
  if (totalRequired === 0) return 100;
  const covered =
    job.requiredModuleIds.filter(id => completedModules.includes(id)).length +
    job.requiredProjectIds.filter(id => completedProjects.includes(id)).length;
  return Math.round((covered / totalRequired) * 100);
}

function formatPosted(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function JobsPage() {
  const { progress, isLoaded } = useProgress();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSource, setActiveSource] = useState<JobSource | "All">("All");
  const [activeExperience, setActiveExperience] = useState<ExperienceBand | "All">("All");
  const [activeTier, setActiveTier] = useState<CompanyTier | "All">("All");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"match" | "salary" | "recent">("match");
  const [showFilters, setShowFilters] = useState(false);

  const jobsWithMatch = useMemo(() => {
    return jobsData.map(job => ({
      ...job,
      matchPct: isLoaded
        ? getMatchPct(job, progress.completedModules, progress.completedProjects)
        : 0,
    }));
  }, [progress, isLoaded]);

  const filtered = useMemo(() => {
    return jobsWithMatch
      .filter(j => {
        if (activeSource !== "All" && j.source !== activeSource) return false;
        if (activeExperience !== "All" && j.experience !== activeExperience) return false;
        if (activeTier !== "All" && j.companyTier !== activeTier) return false;
        if (j.salaryMax < minSalary) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            j.company.toLowerCase().includes(q) ||
            j.role.toLowerCase().includes(q) ||
            j.skills.some(s => s.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchPct - a.matchPct;
        if (sortBy === "salary") return b.salaryMax - a.salaryMax;
        return a.postedDaysAgo - b.postedDaysAgo;
      });
  }, [jobsWithMatch, activeSource, activeExperience, activeTier, minSalary, searchQuery, sortBy]);

  const totalOpenings = filtered.reduce((sum, j) => sum + j.openings, 0);
  const avgSalary = filtered.length
    ? Math.round(filtered.reduce((s, j) => s + (j.salaryMin + j.salaryMax) / 2, 0) / filtered.length)
    : 0;
  const highMatchCount = filtered.filter(j => j.matchPct >= 70).length;

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse inline-block" />
                Live Job Board
              </Badge>
              <span className="text-xs text-gray-600">Last scanned: Today 06:00 IST</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Hyderabad Azure DevOps Jobs
            </h1>
            <p className="text-gray-400 mt-1">
              Aggregated from LinkedIn · Naukri · Foundit — matched to your progress
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors shrink-0">
            <RefreshCw className="w-4 h-4" />
            Rescan Now
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Jobs Found", value: filtered.length, icon: <Briefcase className="w-4 h-4 text-blue-400" />, sub: `${totalOpenings} openings` },
            { label: "Avg Salary", value: `₹${avgSalary}L`, icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, sub: "per annum" },
            { label: "Strong Match", value: highMatchCount, icon: <Star className="w-4 h-4 text-amber-400" />, sub: "≥70% match" },
            { label: "Companies", value: new Set(filtered.map(j => j.company)).size, icon: <Building2 className="w-4 h-4 text-purple-400" />, sub: "hiring now" },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] text-gray-500">{s.label} · {s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search company, role, or skill..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50"
            >
              <option value="match">Sort: Best Match</option>
              <option value="salary">Sort: Highest Salary</option>
              <option value="recent">Sort: Most Recent</option>
            </select>
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${showFilters ? "bg-blue-600/20 border-blue-500/40 text-blue-300" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5 mb-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Source</p>
                <div className="flex flex-wrap gap-2">
                  {["All", ...JOB_SOURCES].map(s => (
                    <button key={s} onClick={() => setActiveSource(s as JobSource | "All")}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${activeSource === s ? "bg-blue-600 border-transparent text-white" : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Experience</p>
                <div className="flex flex-wrap gap-2">
                  {["All", ...EXPERIENCE_BANDS].map(e => (
                    <button key={e} onClick={() => setActiveExperience(e as ExperienceBand | "All")}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${activeExperience === e ? "bg-blue-600 border-transparent text-white" : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Company Tier</p>
                <div className="flex flex-wrap gap-2">
                  {["All", ...COMPANY_TIERS].map(t => (
                    <button key={t} onClick={() => setActiveTier(t as CompanyTier | "All")}
                      className={`px-3 py-1 rounded-full text-xs border transition-colors ${activeTier === t ? "bg-blue-600 border-transparent text-white" : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Min Salary: ₹{minSalary}L+</p>
              <input type="range" min={0} max={40} step={5} value={minSalary}
                onChange={e => setMinSalary(Number(e.target.value))}
                className="w-full md:w-64 accent-blue-500" />
            </div>
          </div>
        )}
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filtered.map((job, idx) => {
          const matchColor =
            job.matchPct >= 80 ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" :
            job.matchPct >= 60 ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
            job.matchPct >= 40 ? "text-orange-400 border-orange-400/30 bg-orange-400/10" :
            "text-red-400 border-red-400/30 bg-red-400/10";

          return (
            <div key={job.id}
              className={`group relative bg-white/[0.02] border rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-xl ${job.isCurrentCompany ? "border-purple-500/30 bg-purple-500/[0.03]" : "border-white/5 hover:border-white/10"}`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {job.isCurrentCompany && (
                <div className="absolute -top-2.5 left-6">
                  <span className="text-[10px] font-bold bg-purple-500 text-white px-3 py-0.5 rounded-full">YOUR COMPANY</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-start gap-4">

                {/* Company Logo */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {job.companyLogo}
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{job.role}</h3>
                    {job.isHybrid && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">Hybrid</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                    <span className="font-semibold text-gray-200">{job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatPosted(job.postedDaysAgo)}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{job.openings} opening{job.openings > 1 ? "s" : ""}</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map(skill => (
                      <span key={skill} className="text-xs bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Right Panel */}
                <div className="flex flex-col items-end gap-3 shrink-0 min-w-[160px]">
                  {/* Salary */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">₹{job.salaryMin}–{job.salaryMax}L</p>
                    <p className="text-xs text-gray-500">per annum · {job.experience}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${TIER_COLORS[job.companyTier]}`}>
                      {job.companyTier}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${SOURCE_COLORS[job.source]}`}>
                      {job.source}
                    </Badge>
                  </div>

                  {/* Match Score */}
                  <div className={`flex flex-col items-center px-4 py-2 rounded-xl border ${matchColor} w-full`}>
                    <span className="text-2xl font-extrabold">{isLoaded ? `${job.matchPct}%` : "—"}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">JD Match</span>
                  </div>

                  {/* Apply Button */}
                  <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-gray-600">
          No jobs match the current filters. Try adjusting the criteria above.
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-xs text-gray-700 mt-10">
        Job data aggregated from LinkedIn, Naukri, and Foundit via automated crawlers · Updated daily at 06:00 IST
      </p>
    </main>
  );
}
