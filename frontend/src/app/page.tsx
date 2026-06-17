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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)] opacity-70" />
        <div className="absolute inset-0 opacity-[0.18] mix-blend-screen animate-[floatBackdrop_18s_ease-in-out_infinite]">
          <DevOpsBackdrop />
        </div>
      </div>

      <main className="relative z-10 container max-w-7xl px-6 py-20 mx-auto flex flex-col gap-10">
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

function DevOpsBackdrop() {
  return (
    <svg viewBox="0 0 1200 800" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="devopsLine" x1="0" y1="0" x2="1200" y2="800" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#22D3EE" stopOpacity="0.55" />
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="nodeGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 400) rotate(90) scale(220 220)">
          <stop stopColor="#93C5FD" stopOpacity="0.55" />
          <stop offset="1" stopColor="#93C5FD" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path className="animate-[dashFlow_22s_linear_infinite]" d="M120 560 C 260 360, 360 340, 520 460 S 820 610, 1040 260" stroke="url(#devopsLine)" strokeWidth="2.5" strokeDasharray="8 12" />
      <path className="animate-[dashFlowReverse_28s_linear_infinite]" d="M160 220 C 310 170, 420 220, 560 320 S 870 500, 1100 180" stroke="url(#devopsLine)" strokeWidth="1.5" strokeDasharray="4 10" opacity="0.7" />
      <circle cx="600" cy="400" r="220" fill="url(#nodeGlow)" className="animate-[pulseGlow_9s_ease-in-out_infinite]" />

      <BackdropNode x={180} y={160} label="Docs" delay="0s" />
      <BackdropNode x={360} y={250} label="Labs" delay="1s" />
      <BackdropNode x={560} y={150} label="Projects" delay="0.4s" />
      <BackdropNode x={820} y={250} label="Jobs" delay="1.4s" />
      <BackdropNode x={980} y={160} label="AI" delay="0.8s" />
      <BackdropNode x={250} y={520} label="Git" delay="1.8s" />
      <BackdropNode x={520} y={600} label="AKS" delay="1.1s" />
      <BackdropNode x={820} y={540} label="Terraform" delay="0.2s" />
      <BackdropNode x={1040} y={470} label="Sentinel" delay="1.6s" />

      <g opacity="0.8">
        <circle cx="600" cy="400" r="66" stroke="rgba(96,165,250,0.75)" strokeWidth="2.5" />
        <circle cx="600" cy="400" r="38" fill="rgba(15,23,42,0.8)" stroke="rgba(34,211,238,0.9)" strokeWidth="2" />
        <path d="M582 396h36M600 378v36M586 384l28 32M614 384l-28 32" stroke="rgba(147,197,253,0.95)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function BackdropNode({ x, y, label, delay }: { x: number; y: number; label: string; delay: string }) {
  return (
    <g style={{ animationDelay: delay }} className="animate-[nodePulse_7s_ease-in-out_infinite]">
      <circle cx={x} cy={y} r="16" fill="rgba(15,23,42,0.65)" stroke="rgba(96,165,250,0.7)" strokeWidth="1.5" />
      <circle cx={x} cy={y} r="6" fill="rgba(34,211,238,0.95)" />
      <text x={x} y={y + 34} textAnchor="middle" fill="rgba(226,232,240,0.72)" fontSize="18" fontFamily="ui-sans-serif, system-ui">{label}</text>
    </g>
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
