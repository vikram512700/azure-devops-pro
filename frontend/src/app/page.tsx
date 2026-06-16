import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Cloud, Terminal, BrainCircuit, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <main className="container max-w-5xl px-6 py-24 mx-auto text-center flex flex-col items-center gap-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-md">
          <SparklesIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Your path to Enterprise DevOps</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 drop-shadow-sm">
          Master Azure DevOps & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            Production Architecture
          </span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
          From fundamentals to SRE. Learn real-world implementations, practice with hands-on labs, 
          and prepare for Hyderabad&apos;s top GCC interviews with our AI mentor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105")}>
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/roadmap" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto rounded-full gap-2 font-semibold border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all")}>
            View Roadmap
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16 w-full max-w-4xl">
          <FeatureCard href="/roadmap" icon={<Cloud className="w-6 h-6 text-blue-400" />} title="Azure Mastery" desc="30 comprehensive learning tracks" />
          <FeatureCard href="/module/1" icon={<Terminal className="w-6 h-6 text-emerald-400" />} title="Real Labs" desc="Hands-on production sandboxes" />
          <FeatureCard href="/interview" icon={<BrainCircuit className="w-6 h-6 text-purple-400" />} title="AI Interviewer" desc="Simulated mock interviews" />
          <FeatureCard href="/jd-analyzer" icon={<Rocket className="w-6 h-6 text-orange-400" />} title="JD Analyzer" desc="Match skills to job roles" />
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
