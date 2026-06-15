"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Copy, Check, PlayCircle } from "lucide-react";

export function LabPanel() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      title: "Log into Azure CLI",
      desc: "Authenticate your local terminal with your Azure Sandbox environment.",
      code: "az login"
    },
    {
      id: 2,
      title: "Create Resource Group",
      desc: "Create a resource group named 'DevOps-Sandbox' in the 'eastus' region.",
      code: "az group create --name DevOps-Sandbox --location eastus"
    },
    {
      id: 3,
      title: "Create Virtual Network",
      desc: "Deploy a VNet with a 10.0.0.0/16 address space.",
      code: "az network vnet create -g DevOps-Sandbox -n CoreVNet --address-prefix 10.0.0.0/16"
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[80vh]">
      
      {/* Left: Instructions Panel */}
      <Card className="lg:col-span-2 bg-white/[0.02] border-white/5 flex flex-col h-full overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-orange-400" />
            Sandbox Instructions
          </CardTitle>
          <CardDescription>
            Follow these steps to complete the VNet Lab.
          </CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-[8px] font-bold text-blue-400">
                  {step.id}
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-200">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  <div className="relative group">
                    <pre className="p-3 pr-12 rounded-md bg-[#0d1117] border border-white/10 text-emerald-400 text-xs font-mono overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                    <button 
                      onClick={() => handleCopy(step.code, idx)}
                      className="absolute right-2 top-2 p-1.5 rounded-md bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 text-gray-300"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Lab Validation</h4>
            <p className="text-xs text-muted-foreground mb-4">Once you have run all the commands, click validate to check your work against the Azure API.</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
              Validate Environment
            </Button>
          </div>
        </ScrollArea>
      </Card>

      {/* Right: Mock Terminal/Browser */}
      <Card className="lg:col-span-3 bg-[#0d1117] border-white/10 flex flex-col h-full overflow-hidden shadow-2xl">
        <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-white/10">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="mx-auto px-4 py-1 rounded bg-[#0d1117] text-xs text-gray-400 font-mono">
            azure-cli — kodekloud-sandbox
          </div>
        </div>
        <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto">
          <p className="text-emerald-400 mb-2">Welcome to Azure Cloud Shell</p>
          <p className="mb-4">Type "az login" to get started...</p>
          <div className="flex items-center gap-2 text-muted-foreground opacity-50">
            <PlayCircle className="w-12 h-12 mx-auto mt-20 text-gray-600" />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4 opacity-50">
            (Interactive Terminal Simulator placeholder)
          </p>
        </div>
      </Card>
      
    </div>
  );
}
