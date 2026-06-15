import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, PlayCircle } from "lucide-react";

import Link from "next/link";

const TRACKS = [
  { id: 1, title: "Azure Virtual Networks", modules: 1, status: "completed", desc: "Deploy a secure Hub-Spoke network topology." },
  { id: 2, title: "Azure Compute & AKS", modules: 1, status: "in-progress", desc: "Architect and scale highly available microservices." },
  { id: 3, title: "Infrastructure as Code", modules: 1, status: "available", desc: "Automate your infrastructure deployments." },
  { id: 4, title: "CI/CD Pipelines", modules: 1, status: "available", desc: "Build and release software at DevOps speed." },
  { id: 5, title: "Monitoring & Observability", modules: 1, status: "available", desc: "Achieve SRE excellence through proactive alerting." },
  { id: 6, title: "Identity & Security", modules: 1, status: "available", desc: "Implement Zero-Trust architecture." },
  { id: 7, title: "Azure Storage", modules: 1, status: "available", desc: "Design durable, scalable data storage solutions." },
  { id: 8, title: "Container Registries", modules: 1, status: "available", desc: "Secure and distribute your container images." },
  { id: 9, title: "Cost Management", modules: 1, status: "available", desc: "Govern cloud spend and enforce compliance." },
  { id: 10, title: "Chaos Engineering", modules: 1, status: "available", desc: "Test resiliency by injecting faults into production." },
];

export default function Roadmap() {
  return (
    <div className="min-h-screen p-8 pt-24 bg-background relative">
      {/* Background decoration */}
      <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-blue-500/30 text-blue-400 px-3 py-1 bg-blue-500/10">10-Track Journey</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Enterprise DevOps Roadmap</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A structured path from beginner to advanced SRE. Each module contains Theory, Real World Examples, Architecture, Labs, Troubleshooting, and Interview Prep.
          </p>
        </div>

        <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 md:pl-0 space-y-12">
          {TRACKS.map((track, index) => (
            <div key={track.id} className="relative pl-8 md:pl-0">
              
              {/* Timeline dot */}
              <div className="absolute left-[-9px] md:left-[-1px] top-6 w-4 h-4 rounded-full bg-background border-2 border-blue-500 z-10 hidden md:block" />
              <div className="absolute left-[-9px] top-6 w-4 h-4 rounded-full bg-background border-2 border-blue-500 z-10 md:hidden" />

              <Card className={`bg-white/[0.02] border-white/[0.05] md:ml-8 transition-all hover:bg-white/[0.04] ${track.status === 'locked' ? 'opacity-60 grayscale-[0.5]' : 'shadow-[0_0_20px_rgba(37,99,235,0.05)]'}`}>
                <CardHeader className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-white/10 text-white border-none">Track {track.id}</Badge>
                      {track.status === 'completed' && <Badge className="bg-emerald-500/20 text-emerald-400 border-none hover:bg-emerald-500/30">Completed</Badge>}
                      {track.status === 'in-progress' && <Badge className="bg-blue-500/20 text-blue-400 border-none hover:bg-blue-500/30 animate-pulse">In Progress</Badge>}
                    </div>
                    <CardTitle className="text-2xl text-white">{track.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{track.desc}</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {track.status === 'locked' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 text-muted-foreground border border-white/10 text-sm">
                        <Lock className="w-4 h-4" /> Locked
                      </div>
                    ) : (
                      <Link href={`/module/${track.id}`}>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                          <PlayCircle className="w-4 h-4" /> 
                          {track.status === 'completed' ? 'Review Track' : 'Continue'}
                        </button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Modules:</span> <span className="text-white font-medium">{track.modules}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Sections per Module:</span> <span className="text-white font-medium">6</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
