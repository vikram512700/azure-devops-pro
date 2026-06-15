"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Terminal, CheckCircle2, ChevronRight, Trophy } from "lucide-react";

type Step = {
  id: string;
  command: string;
  output: string;
  isFix: boolean;
};

const SCENARIO_STEPS: Step[] = [
  {
    id: "check-nodes",
    command: "kubectl get nodes",
    output: "NAME                 STATUS   ROLES   AGE   VERSION\naks-nodepool1-1234   Ready    agent   12d   v1.28.3\naks-nodepool1-5678   Ready    agent   12d   v1.28.3",
    isFix: false
  },
  {
    id: "check-pods",
    command: "kubectl get pods -n production",
    output: "NAME                             READY   STATUS      RESTARTS      AGE\ncheckout-service-7f89b4c-xyz     0/1     OOMKilled   12 (2m ago)   1h\npayment-service-8b54f9d-abc      1/1     Running     0             1h",
    isFix: false
  },
  {
    id: "describe-pod",
    command: "kubectl describe pod checkout-service-7f89b4c-xyz -n production",
    output: "Name:             checkout-service-7f89b4c-xyz\nNamespace:        production\n...\nState:          Waiting\nReason:         CrashLoopBackOff\nLast State:     Terminated\nReason:         OOMKilled\nExit Code:      137\n...\nLimits:\n  cpu:     500m\n  memory:  256Mi\nRequests:\n  cpu:     250m\n  memory:  128Mi",
    isFix: false
  },
  {
    id: "fix-memory",
    command: "kubectl set resources deployment checkout-service -n production --limits=memory=512Mi",
    output: "deployment.apps/checkout-service resource requirements updated",
    isFix: true
  }
];

export function TroubleshootingSimulator() {
  const [history, setHistory] = useState<Step[]>([]);
  const [solved, setSolved] = useState(false);

  const runCommand = (step: Step) => {
    if (history.find(h => h.id === step.id)) return;
    setHistory(prev => [...prev, step]);
    
    if (step.isFix) {
      setTimeout(() => setSolved(true), 1500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
      
      {/* Action Panel */}
      <Card className="bg-white/[0.02] border-white/5 flex flex-col overflow-hidden">
        <CardHeader className="bg-red-500/5 border-b border-red-500/10">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Active Incident: P1 Outage
          </CardTitle>
          <CardDescription>
            Alert: Checkout service is flapping and restarting continuously in production.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Available Diagnostics</h3>
          <div className="space-y-3 flex-1">
            {SCENARIO_STEPS.map((step) => {
              const hasRun = history.some(h => h.id === step.id);
              return (
                <Button 
                  key={step.id}
                  variant="outline"
                  onClick={() => runCommand(step)}
                  disabled={hasRun || solved}
                  className={`w-full justify-start font-mono text-xs border-white/10 ${hasRun ? 'bg-white/5 opacity-50' : 'bg-black/40 hover:bg-white/10'} ${step.isFix && !hasRun ? 'border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400' : ''}`}
                >
                  <ChevronRight className="w-3 h-3 mr-2" />
                  {step.command}
                </Button>
              );
            })}
          </div>

          {solved && (
            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg animate-in fade-in zoom-in duration-500 text-center">
              <Trophy className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-emerald-400">Incident Resolved!</h4>
              <p className="text-sm text-emerald-200/70 mt-1">You identified the OOMKilled status and increased memory limits. +50 XP</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terminal View */}
      <Card className="bg-[#0d1117] border-white/10 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-white/10">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="mx-auto px-4 py-1 rounded bg-[#0d1117] text-xs text-gray-400 font-mono flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            prod-aks-bastion
          </div>
        </div>
        <ScrollArea className="flex-1 p-4 font-mono text-sm text-gray-300">
          <div className="space-y-4">
            <p className="text-emerald-400">Welcome to Azure Cloud Shell (SRE Simulator)</p>
            
            {history.map((step, idx) => (
              <div key={idx} className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex gap-2 text-blue-400">
                  <span className="text-pink-500">vikram@azure:~$</span>
                  {step.command}
                </div>
                <pre className="whitespace-pre-wrap text-gray-300 opacity-90 pl-2 border-l-2 border-white/10">
                  {step.output}
                </pre>
              </div>
            ))}

            {solved && (
              <div className="flex gap-2 text-blue-400 mt-4 animate-in fade-in">
                <span className="text-pink-500">vikram@azure:~$</span>
                <span className="w-2 h-4 bg-white animate-pulse"></span>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

    </div>
  );
}
