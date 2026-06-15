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
              <h1 className="text-3xl font-extrabold text-white tracking-tight">VNet Implementation</h1>
              <p className="text-muted-foreground mt-2 text-lg">Deploy a secure Hub-Spoke network topology.</p>
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
                <CardTitle className="text-xl text-white">Azure Virtual Networks (VNet)</CardTitle>
                <CardDescription>Core networking component in Azure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">What is a VNet?</strong><br />
                  A Virtual Network (VNet) is the fundamental building block for your private network in Azure. It enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks.
                </p>
                <p>
                  <strong className="text-white">Key Concepts:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-blue-400">Address Space:</strong> The CIDR block for the VNet (e.g. 10.0.0.0/16).</li>
                  <li><strong className="text-blue-400">Subnets:</strong> Smaller logical partitions of your VNet (e.g. 10.0.1.0/24).</li>
                  <li><strong className="text-blue-400">Network Security Groups (NSG):</strong> Firewalls containing security rules that allow or deny inbound/outbound network traffic.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="real-world" className="mt-0">
            <Card className="bg-white/[0.02] border-white/5 border border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="text-xl text-white">Jio/Reliance Enterprise Use Case</CardTitle>
                <CardDescription>How VNets are used in production at scale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  In a massive GCC like Jio Platforms, you don't just create isolated networks. You use a <strong className="text-emerald-400">Hub-Spoke Topology</strong> to manage hundreds of microservices.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong className="text-white">Hub VNet:</strong> Acts as the central point of connectivity to the on-premises Jio Data Center via ExpressRoute. It houses shared services like Azure Firewall, Bastion, and Private DNS Resolvers.</li>
                  <li><strong className="text-white">Spoke VNets:</strong> Each product team (e.g., JioMart, JioCinema) gets their own isolated Spoke VNet. This Spoke VNet is peered directly to the Hub VNet.</li>
                </ul>
                <div className="p-4 bg-black/40 rounded border border-white/10 font-mono text-sm mt-4 text-gray-400">
                  <strong className="text-purple-400"># Vikram's AWS-to-Azure Shortcut:</strong><br />
                  AWS VPC == Azure VNet<br />
                  AWS Subnet == Azure Subnet<br />
                  AWS Security Group == Azure NSG
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
              <Card className="bg-white/[0.02] border-white/10">
                <CardHeader>
                  <CardTitle className="text-md text-white">Q: What is the difference between an NSG and Azure Firewall?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-400 leading-relaxed">
                  <strong className="text-indigo-400">Answer:</strong> An NSG operates at Layer 3/4 and allows/denies traffic based on simple 5-tuple rules (Source/Dest IP, Port, Protocol). Azure Firewall is a managed network security service operating at Layer 7 with threat intelligence and deep packet inspection.
                </CardContent>
              </Card>
              <Card className="bg-white/[0.02] border-white/10">
                <CardHeader>
                  <CardTitle className="text-md text-white">Q: How do you connect two VNets in different regions?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-400 leading-relaxed">
                  <strong className="text-indigo-400">Answer:</strong> By using Global VNet Peering. It securely routes traffic through the Microsoft backbone infrastructure without needing a public internet connection or VPN gateway.
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-0">
            <QuizEngine />
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
