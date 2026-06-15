"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, BookOpen, Presentation, Database, Terminal, AlertTriangle, HelpCircle } from "lucide-react";
import { QuizEngine } from "@/components/QuizEngine";
import { LabPanel } from "@/components/LabPanel";
import { ArchitectureVisualizer } from "@/components/ArchitectureVisualizer";
import { TroubleshootingSimulator } from "@/components/TroubleshootingSimulator";
import { modulesData } from "@/data/modules";

export function ModuleClient({ moduleId }: { moduleId: string }) {
  const [activeTab, setActiveTab] = useState("lab");

  const SECTIONS = [
    { id: "theory", title: "1. Theory", icon: <BookOpen className="w-5 h-5 text-blue-400" />, status: "completed" },
    { id: "real-world", title: "2. Real World Example", icon: <Presentation className="w-5 h-5 text-emerald-400" />, status: "completed" },
    { id: "architecture", title: "3. Production Architecture", icon: <Database className="w-5 h-5 text-purple-400" />, status: "completed" },
    { id: "lab", title: "4. Hands-On Lab", icon: <Terminal className="w-5 h-5 text-orange-400" />, status: "current" },
    { id: "troubleshoot", title: "5. Troubleshooting", icon: <AlertTriangle className="w-5 h-5 text-red-400" />, status: "locked" },
    { id: "interview", title: "6. Interview Prep", icon: <HelpCircle className="w-5 h-5 text-indigo-400" />, status: "locked" },
  ];

  const moduleData = modulesData[moduleId];

  if (!moduleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <h1 className="text-3xl font-bold">Module {moduleId} is coming soon!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white/[0.02] border-r border-white/5 flex-shrink-0 pt-20 md:min-h-screen">
        <div className="p-6">
          <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Module {moduleId}</Badge>
          <h2 className="text-xl font-bold text-white mb-6">{moduleData.title}</h2>
          
          <nav className="space-y-1">
            {SECTIONS.map((section) => (
              <button 
                key={section.id} 
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === section.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 
                    'text-gray-300 hover:bg-white/5'}`}
              >
                {activeTab === section.id ? <CheckCircle2 className="w-5 h-5 text-blue-500" /> : 
                 section.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : 
                 <Circle className="w-5 h-5 text-gray-700" />}
                <span className="flex-1 text-left">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 pt-20 md:pt-24 max-w-6xl w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{moduleData.subtitle}</h1>
              <p className="text-muted-foreground mt-2 text-lg">{moduleData.description}</p>
            </div>
            <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto">
              <TabsTrigger value="theory" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Theory</TabsTrigger>
              <TabsTrigger value="real-world" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">Real World</TabsTrigger>
              <TabsTrigger value="architecture" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Architecture</TabsTrigger>
              <TabsTrigger value="lab" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Interactive Lab</TabsTrigger>
              <TabsTrigger value="troubleshoot" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Troubleshoot</TabsTrigger>
              <TabsTrigger value="interview" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Interview Prep</TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Knowledge Check</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="theory" className="mt-0">
            <Card className="bg-white/[0.02] border-white/5 border border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-xl text-white">{moduleData.theory.title}</CardTitle>
                <CardDescription>{moduleData.theory.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">What is it?</strong><br />
                  {moduleData.theory.whatIsIt}
                </p>
                <p>
                  <strong className="text-white">Key Concepts:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  {moduleData.theory.keyConcepts.map((kc, i) => (
                    <li key={i}><strong className="text-blue-400">{kc.label}:</strong> {kc.desc}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="real-world" className="mt-0">
            <Card className="bg-white/[0.02] border-white/5 border border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="text-xl text-white">{moduleData.realWorld.title}</CardTitle>
                <CardDescription>{moduleData.realWorld.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  {moduleData.realWorld.intro}
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  {moduleData.realWorld.points.map((pt, i) => {
                    const parts = pt.split(': ');
                    return (
                      <li key={i}><strong className="text-white">{parts[0]}:</strong> {parts.slice(1).join(': ')}</li>
                    );
                  })}
                </ul>
                <div className="p-4 bg-black/40 rounded border border-white/10 font-mono text-sm mt-4 text-gray-400 whitespace-pre-line">
                  <strong className="text-purple-400"># Vikram's AWS-to-Azure Shortcut:</strong><br />
                  {moduleData.realWorld.shortcut}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="mt-0 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Production Architecture Explorer</h2>
            <ArchitectureVisualizer />
          </TabsContent>

          <TabsContent value="lab" className="mt-0">
            <LabPanel />
          </TabsContent>

          <TabsContent value="troubleshoot" className="mt-0 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Troubleshooting Simulator</h2>
            <TroubleshootingSimulator />
          </TabsContent>

          <TabsContent value="interview" className="mt-0 space-y-4">
            <h2 className="text-xl font-bold text-white mb-2">Level 1 - 4 Interview Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moduleData.interview.map((qa, i) => (
                <Card key={i} className="bg-white/[0.02] border-white/10">
                  <CardHeader>
                    <CardTitle className="text-md text-white">Q: {qa.q}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400 leading-relaxed">
                    <strong className="text-indigo-400">Answer:</strong> {qa.a}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-0">
            <QuizEngine moduleId={moduleId} />
          </TabsContent>
          
          <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
            <button className="px-6 py-2 rounded-md bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
              Previous Section
            </button>
            <button className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-900/20">
              Next Section
            </button>
          </div>
        </Tabs>
      </main>

    </div>
  );
}
