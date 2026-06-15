import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, BookOpen, Presentation, Database, Terminal, AlertTriangle, HelpCircle } from "lucide-react";

export default function ModulePage({ params }: { params: { id: string } }) {
  // In a real app, fetch module data based on params.id
  const moduleId = params.id;

  const SECTIONS = [
    { id: "theory", title: "1. Theory", icon: <BookOpen className="w-5 h-5 text-blue-400" />, status: "completed" },
    { id: "real-world", title: "2. Real World Example", icon: <Presentation className="w-5 h-5 text-emerald-400" />, status: "completed" },
    { id: "architecture", title: "3. Production Architecture", icon: <Database className="w-5 h-5 text-purple-400" />, status: "current" },
    { id: "lab", title: "4. Hands-On Lab", icon: <Terminal className="w-5 h-5 text-orange-400" />, status: "locked" },
    { id: "troubleshoot", title: "5. Troubleshooting", icon: <AlertTriangle className="w-5 h-5 text-red-400" />, status: "locked" },
    { id: "interview", title: "6. Interview Prep", icon: <HelpCircle className="w-5 h-5 text-indigo-400" />, status: "locked" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white/[0.02] border-r border-white/5 flex-shrink-0 pt-20 md:min-h-screen">
        <div className="p-6">
          <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Module {moduleId}</Badge>
          <h2 className="text-xl font-bold text-white mb-6">Azure Virtual Networks</h2>
          
          <nav className="space-y-1">
            {SECTIONS.map((section) => (
              <button 
                key={section.id} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${section.status === 'current' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 
                    section.status === 'completed' ? 'text-gray-300 hover:bg-white/5' : 
                    'text-gray-600 cursor-not-allowed'}`}
              >
                {section.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : 
                 section.status === 'current' ? section.icon : <Circle className="w-5 h-5 text-gray-700" />}
                <span className="flex-1 text-left">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 pt-20 md:pt-24 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Production Architecture</h1>
            <p className="text-muted-foreground mt-2 text-lg">Designing secure and scalable network topologies in Azure.</p>
          </div>

          <Card className="bg-white/[0.02] border-white/5 border border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-xl text-white">Hub-Spoke Topology</CardTitle>
              <CardDescription>Industry standard architecture for enterprise scale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video w-full rounded-lg bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]" />
                <p className="text-muted-foreground font-mono text-sm z-10">Architecture_Diagram_Placeholder.png</p>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The hub is a virtual network (VNet) in Azure that acts as a central point of connectivity to your on-premises network. 
                The spokes are VNets that peer with the hub, and can be used to isolate workloads.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-8 border-t border-white/5">
            <button className="px-6 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
              Previous: Real World Example
            </button>
            <button className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-900/20">
              Next: Hands-On Lab
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}
