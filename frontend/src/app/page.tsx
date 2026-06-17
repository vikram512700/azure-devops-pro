import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Cloud, Terminal, BrainCircuit, Rocket, BookOpenText, BriefcaseBusiness, Layers3, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_30%)]" />
      </div>

      <main className="container max-w-7xl px-6 py-20 mx-auto flex flex-col gap-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div className="flex flex-col gap-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-md w-fit">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Enterprise DevOps, built like a real product</span>
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/65 drop-shadow-sm">
                Master Azure DevOps & <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-500">
                  Production Architecture
                </span>
              </h1>
              <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                From fundamentals to SRE, with projects, docs, job intelligence, and AI interview prep wired together like a real learning platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105")}>
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/projects" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto rounded-full gap-2 font-semibold border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all")}>
                Browse Projects
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 pt-3">
              <MiniStat icon={<BookOpenText className="w-4 h-4 text-blue-300" />} label="Docs" value="Runbooks + field notes" />
              <MiniStat icon={<BriefcaseBusiness className="w-4 h-4 text-emerald-300" />} label="Jobs" value="Market-driven skill gaps" />
              <MiniStat icon={<ShieldCheck className="w-4 h-4 text-amber-300" />} label="Projects" value="Finish like production" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 shadow-2xl">
              <div className="flex items-center gap-2 text-blue-300 mb-3">
                <Layers3 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-[0.2em]">What this gives you</span>
              </div>
              <div className="space-y-3">
                {[
                  "A roadmap that turns theory into deployable systems",
                  "Docs that read like production notes, not school notes",
                  "Projects with a clear finish line and interview story",
                  "A dashboard that shows what to do next"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/20 p-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
                    <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-black/20 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Daily experience</p>
              <p className="text-gray-200 text-sm leading-relaxed">
                Open the dashboard, continue a module, inspect a project, read the docs, or check market trends. Everything is connected so the platform feels like one system.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2 w-full">
          <FeatureCard href="/roadmap" icon={<Cloud className="w-6 h-6 text-blue-400" />} title="Azure Mastery" desc="30 learning tracks with real delivery context" />
          <FeatureCard href="/module/1" icon={<Terminal className="w-6 h-6 text-emerald-400" />} title="Real Labs" desc="Hands-on practice with validation steps" />
          <FeatureCard href="/interview" icon={<BrainCircuit className="w-6 h-6 text-purple-400" />} title="AI Interviewer" desc="Scenario-led mock interviews" />
          <FeatureCard href="/jd-analyzer" icon={<Rocket className="w-6 h-6 text-orange-400" />} title="JD Analyzer" desc="Match skills to real hiring signals" />
        </div>
      </main>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm text-gray-200 leading-relaxed">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="flex flex-col items-center p-6 space-y-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/[0.15] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 cursor-pointer group">
      <div className="p-3 rounded-full bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-center text-muted-foreground">{desc}</p>
    </Link>
  )
}
